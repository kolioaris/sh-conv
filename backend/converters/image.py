import pyvips
from wand.image import Image as WandImage

VIPS_FORMATS = {"png", "jpg", "jpeg", "webp", "tiff", "avif"}
MAGICK_FORMATS = {"psd", "ico", "bmp", "jp2", "tga", "ppm"}
LOSSLESS_SUPPORTED = {"png", "webp", "avif", "tiff"}


def convert_image(input_path: str, output_path: str, options: dict):
    ext = output_path.rsplit(".", 1)[-1].lower()
    quality = options.get("quality", 90)
    lossless = options.get("lossless", False) and ext in LOSSLESS_SUPPORTED
    strip = options.get("strip_metadata", False)
    scale = options.get("scale", 1.0)
    metadata = options.get("metadata", {})

    if ext in VIPS_FORMATS:
        image = pyvips.Image.new_from_file(input_path)

        if scale and scale != 1.0:
            image = image.resize(scale)  # type: ignore

        if strip:
            image = image.copy()  # type: ignore
            for field in image.get_fields():
                if field not in ["width", "height", "bands", "format"]:
                    try:
                        image.remove(field)
                    except:
                        pass

        kwargs = {}
        if lossless and ext != "png":
            kwargs["lossless"] = True
        else:
            kwargs["Q"] = quality

        image.write_to_file(output_path, **kwargs)

    elif ext in MAGICK_FORMATS:
        with WandImage(filename=input_path) as img:
            if ext == "ico":
                if img.width > 256 or img.height > 256:
                    ratio = min(256 / img.width, 256 / img.height)
                    new_w = int(img.width * ratio)
                    new_h = int(img.height * ratio)
                    img.resize(new_w, new_h)
                elif scale and scale != 1.0:
                    new_w = int(img.width * scale)
                    new_h = int(img.height * scale)
                    img.resize(new_w, new_h)
            if strip:
                img.strip()
            if not lossless:
                img.compression_quality = quality
            if metadata:
                for key, value in metadata.items():
                    img.metadata[key] = str(value)
            img.save(filename=output_path)
    else:
        raise ValueError(f"Unsupported output format: {ext}")
