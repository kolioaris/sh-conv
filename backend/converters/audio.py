import ffmpeg


def convert_audio(input_path: str, output_path: str, options: dict):
    ext = output_path.rsplit(".", 1)[-1].lower()
    bitrate = options.get("bitrate", "192k")
    sample_rate = options.get("sample_rate", 44100)
    channels = options.get("channels", 2)
    metadata = options.get("metadata", {})

    lossless_formats = {"flac", "wav", "aiff", "alac"}

    output_kwargs = {
        "ar": sample_rate,
        "ac": channels,
    }

    if ext not in lossless_formats:
        output_kwargs["audio_bitrate"] = bitrate

    for key, value in metadata.items():
        output_kwargs[f"metadata:g:{key}"] = value

    ffmpeg.input(input_path).output(output_path, **
                                    output_kwargs).run(overwrite_output=True)
