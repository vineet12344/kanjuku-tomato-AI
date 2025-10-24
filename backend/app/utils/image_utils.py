from PIL import Image
import numpy as np

def resize_keep_aspect(image: Image.Image, target_size=(640, 640)):
    """Resize keeping aspect ratio and pad to target_size (if needed)."""
    image = image.convert("RGB")
    image.thumbnail(target_size, Image.ANTIALIAS)
    new_img = Image.new("RGB", target_size, (114, 114, 114))
    left = (target_size[0] - image.size[0]) // 2
    top = (target_size[1] - image.size[1]) // 2
    new_img.paste(image, (left, top))
    return new_img
