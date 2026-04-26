import ffmpeg

CODEC_MAP = {
    "mp4":  {"vcodec": "libx264", "acodec": "aac"},
    "mkv":  {"vcodec": "libx264", "acodec": "aac"},
    "avi":  {"vcodec": "libx264", "acodec": "mp3"},
    "mov":  {"vcodec": "libx264", "acodec": "aac"},
    "webm": {"vcodec": "libvpx-vp9", "acodec": "libopus"},
    "flv":  {"vcodec": "libx264", "acodec": "aac"},
    "m4v":  {"vcodec": "libx264", "acodec": "aac"},
    "ogv":  {"vcodec": "libtheora", "acodec": "libvorbis"},
    "mpg":  {"vcodec": "mpeg2video", "acodec": "mp2"},
    "mpeg": {"vcodec": "mpeg2video", "acodec": "mp2"},
}


def convert_video(input_path: str, output_path: str, options: dict):
    ext = output_path.rsplit(".", 1)[-1].lower()
    crf = options.get("crf", 23)
    resolution = options.get("resolution", None)
    fps = options.get("fps", None)
    audio_bitrate = options.get("audio_bitrate", "192k")
    metadata = options.get("metadata", {})

    codecs = CODEC_MAP.get(ext, {"vcodec": "libx264", "acodec": "aac"})

    stream = ffmpeg.input(input_path)

    vf_filters = []
    if resolution:
        vf_filters.append(f"scale={resolution}")
    if fps:
        vf_filters.append(f"fps={fps}")

    output_kwargs = {
        "crf": crf,
        "audio_bitrate": audio_bitrate,
        **codecs,
    }

    if vf_filters:
        output_kwargs["vf"] = ",".join(vf_filters)

    for key, value in metadata.items():
        output_kwargs[f"metadata:g:{key}"] = value

    ffmpeg.output(stream, output_path, **
                  output_kwargs).run(overwrite_output=True)
