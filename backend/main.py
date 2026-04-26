from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from converters.video import convert_video
from converters.audio import convert_audio
from converters.image import convert_image
from converters.ytdlp import download_media
from psutil import Process, virtual_memory, cpu_percent
from os import path, makedirs, remove, getpid
from uuid import uuid4
import json
import shutil
import io
import zipfile

CONFIG_FILE = "/app/config.json"
SETTINGS_FILE = "./data/settings.json"
UPLOAD_DIR = "./data/uploads"
OUTPUT_DIR = "./data/outputs"
DOWNLOAD_DIR = "./data/downloads"


def load_config():
    if path.exists(CONFIG_FILE):
        with open(CONFIG_FILE, "r") as f:
            return json.load(f)
    return {
        "backend": {"host": "0.0.0.0", "port": 8000},
        "frontend": {"host": "0.0.0.0", "port": 3000},
        "api_base": "http://localhost:8000"
    }


config = load_config()
BACKEND_HOST = config["backend"]["host"]
BACKEND_PORT = config["backend"]["port"]
API_BASE = config["api_base"]

app = FastAPI(docs_url=None, redoc_url=None)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

makedirs(UPLOAD_DIR, exist_ok=True)
makedirs(OUTPUT_DIR, exist_ok=True)

VIDEO_FORMATS = {"mp4", "mkv", "avi", "mov", "webm", "flv",
                 "m4v", "3gp", "3g2", "ogv", "mpg", "mpeg", "wmv", "asf"}
AUDIO_FORMATS = {"mp3", "aac", "flac", "opus", "wav", "ogg",
                 "m4a", "wma", "aiff", "alac", "ape", "tak", "tta"}


def load_settings():
    if not path.exists(SETTINGS_FILE):
        return {
            "darkmode": True,
            "colorTheme": "Default",
            "defaultImageFormat": "png",
            "defaultVideoFormat": "mp4",
            "defaultAudioFormat": "mp3",
            "defaultImageQuality": 90,
            "defaultImageScale": 1.0,
            "defaultVideoCrf": 23,
            "defaultVideoResolution": "",
            "defaultVideoFps": "",
            "defaultAudioBitrate": "192k",
            "defaultAudioSampleRate": 44100,
            "defaultAudioChannels": 2,
            "defaultDownloadFormat": "mp4",
            "defaultDownloadQuality": "best",
            "defaultDownloadEmbedThumbnail": False,
            "defaultDownloadEmbedMetadata": False,
            "defaultDownloadAudioSampleRate": 44100,
            "defaultDownloadAudioChannels": 2,
        }
    with open(SETTINGS_FILE, "r") as f:
        return json.load(f)


def save_settings(settings):
    makedirs("./data", exist_ok=True)
    with open(SETTINGS_FILE, "w") as f:
        json.dump(settings, f, indent=4)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/settings")
async def update_settings(data: dict):
    settings = load_settings()
    settings.update(data)
    save_settings(settings)
    return {"ok": True}


@app.post("/darkmode")
async def set_darkmode(data: dict):
    settings = load_settings()
    settings["darkmode"] = data["enabled"]
    save_settings(settings)
    return {"ok": True}


@app.post("/colortheme")
async def set_colortheme(data: dict):
    settings = load_settings()
    settings["colorTheme"] = data["theme"]
    save_settings(settings)
    return {"ok": True}


@app.get("/stats")
async def get_stats():
    process = Process(getpid())
    mem = process.memory_info().rss / 1024 / 1024
    cpu = process.cpu_percent(interval=0.1)

    return {
        "backend": {
            "ram_mb": round(mem, 1),
            "cpu_percent": round(cpu, 1),
        },
        "system": {
            "total_ram_mb": round(virtual_memory().total / 1024 / 1024),
            "available_ram_mb": round(virtual_memory().available / 1024 / 1024),
            "cpu_percent": round(cpu_percent(interval=0.1), 1),
        }
    }


@app.post("/convert")
async def convert(
    file: UploadFile = File(...),
    output_format: str = Form(...),
    options: str = Form(default="{}")
):
    filename = file.filename or "file"
    input_ext = filename.rsplit(".", 1)[-1].lower()
    file_id = str(uuid4())
    input_path = f"{UPLOAD_DIR}/{file_id}.{input_ext}"
    output_path = f"{OUTPUT_DIR}/{file_id}.{output_format}"

    with open(input_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    await file.close()

    opts = json.loads(options)

    try:
        if output_format in VIDEO_FORMATS or input_ext in VIDEO_FORMATS:
            convert_video(input_path, output_path, opts)
        elif output_format in AUDIO_FORMATS or input_ext in AUDIO_FORMATS:
            convert_audio(input_path, output_path, opts)
        else:
            convert_image(input_path, output_path, opts)
    finally:
        try:
            if path.exists(input_path):
                remove(input_path)
        except Exception as e:
            print(f"Could not delete input file: {e}")

    with open(output_path, "rb") as f:
        file_bytes = f.read()

    try:
        if path.exists(output_path):
            remove(output_path)
    except Exception as e:
        print(f"Could not delete output file: {e}")

    return Response(
        content=file_bytes,
        media_type="application/octet-stream",
        headers={
            "Content-Disposition": f"attachment; filename=converted.{output_format}"}
    )


@app.post("/download")
async def download(data: dict):
    url = data.get("url")
    format = data.get("format", "mp4")
    quality = data.get("quality", "best")
    options = data.get("options", {})

    if not url:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="URL is required")

    try:
        output_files = download_media(
            url, DOWNLOAD_DIR, format, quality, options)
    except Exception as e:
        from fastapi import HTTPException
        raise HTTPException(status_code=500, detail=str(e))

    if not output_files:
        from fastapi import HTTPException
        raise HTTPException(
            status_code=500, detail="Download failed — no output files found")

    if len(output_files) > 1:
        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zf:
            for f in output_files:
                zf.write(f, path.basename(f))
        zip_buffer.seek(0)
        zip_bytes = zip_buffer.read()
        for f in output_files:
            try:
                remove(f)
            except:
                pass
        return Response(
            content=zip_bytes,
            media_type="application/zip",
            headers={"Content-Disposition": "attachment; filename=playlist.zip"}
        )

    output_file = output_files[0]
    with open(output_file, "rb") as f:
        file_bytes = f.read()
    try:
        remove(output_file)
    except Exception as e:
        print(f"Could not delete download file: {e}")

    filename = path.basename(output_file)
    return Response(
        content=file_bytes,
        media_type="application/octet-stream",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


@app.get("/customcss")
async def get_custom_css():
    settings = load_settings()
    return {"css": settings.get("customCss", "")}


@app.post("/customcss")
async def set_custom_css(data: dict):
    settings = load_settings()
    settings["customCss"] = data["css"]
    save_settings(settings)
    return {"ok": True}
