from os.path import join, splitext, exists
import yt_dlp


def download_media(url: str, output_dir: str, format: str, quality: str, options: dict) -> list[str]:
    embed_thumbnail = options.get("embed_thumbnail", False)
    embed_metadata = options.get("embed_metadata", False)
    audio_sample_rate = options.get("audio_sample_rate", None)
    audio_channels = options.get("audio_channels", None)

    output_template = join(output_dir, "%(title)s.%(ext)s")
    postprocessors = []

    if format == "mp3":
        bitrate = quality if quality in ["320", "192", "128", "96"] else "192"
        ydl_opts = {
            "format": "bestaudio/best",
            "outtmpl": output_template,
            "quiet": True,
            "no_warnings": True,
            "noplaylist": True,
        }
        postprocessors.append({
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",
            "preferredquality": bitrate,
        })
        if audio_sample_rate or audio_channels:
            postprocessors.append({
                "key": "FFmpegPostProcessor",
                "args": [
                    *(["-ar", str(audio_sample_rate)]
                      if audio_sample_rate else []),
                    *(["-ac", str(audio_channels)] if audio_channels else []),
                ]
            })
    else:
        if quality == "best":
            fmt = "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best"
        else:
            fmt = f"bestvideo[height<={quality}][ext=mp4]+bestaudio[ext=m4a]/best[height<={quality}][ext=mp4]/best[height<={quality}]"
        ydl_opts = {
            "format": fmt,
            "outtmpl": output_template,
            "merge_output_format": "mp4",
            "quiet": True,
            "no_warnings": True,
            "noplaylist": True,
        }
        postprocessors.append({
            "key": "FFmpegVideoConvertor",
            "preferedformat": "mp4",
        })

    if embed_thumbnail:
        postprocessors.append({"key": "EmbedThumbnail"})
        ydl_opts["writethumbnail"] = True

    if embed_metadata:
        postprocessors.append({"key": "FFmpegMetadata", "add_metadata": True})

    ydl_opts["postprocessors"] = postprocessors

    output_files: list[str] = []

    def progress_hook(d: dict) -> None:
        if d["status"] == "finished":
            output_files.append(d["filename"])

    ydl_opts["progress_hooks"] = [progress_hook]

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:  # type: ignore
        ydl.extract_info(url, download=True)

    fixed = []
    for f in output_files:
        base = splitext(f)[0]
        expected = f"{base}.{format}"
        if exists(expected):
            fixed.append(expected)
        elif exists(f):
            fixed.append(f)

    return fixed if fixed else []
