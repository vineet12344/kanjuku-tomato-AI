"""
Load YOLO model once and provide an async wrapper to run inference without blocking the event loop.
"""

from ultralytics import YOLO
from PIL import Image, ImageDraw, ImageFont
import numpy as np
import io
import base64
import asyncio
from app.core.config import settings

# Load model once at import (adjust device if needed, e.g., device='cpu' or 'cuda:0')
model = YOLO(settings.MODEL_PATH)

# Optionally set model params (confidence threshold, iou for nms etc)
DEFAULT_CONF = 0.45
DEFAULT_IOU = 0.45


def _postprocess_and_annotate(results, original_image: Image.Image, conf_threshold=0.25):
    """
    results: ultralytics Results object (list-like)
    original_image: PIL Image (RGB)
    Returns: dict with detections and base64 annotated image
    """
    detections = []
    img_draw = original_image.copy()
    draw = ImageDraw.Draw(img_draw)

    # Try to choose a basic font, fallback to default
    try:
        font = ImageFont.load_default()
    except Exception:
        font = None

    res = results[0]
    boxes = getattr(res, "boxes", None)
    names = getattr(res, "names", {})

    if boxes is None:
        return {"detections": [], "annotated_image": None}

    xyxy = boxes.xyxy.cpu().numpy() if hasattr(boxes, "xyxy") else np.array([])
    confs = boxes.conf.cpu().numpy() if hasattr(boxes, "conf") else np.array([])
    cls_idxs = boxes.cls.cpu().numpy().astype(int) if hasattr(boxes, "cls") else np.array([])

    for (box, conf, cls) in zip(xyxy, confs, cls_idxs):
        if float(conf) < conf_threshold:
            continue

        x1, y1, x2, y2 = map(int, box.tolist())
        label = names.get(int(cls), str(int(cls)))

        detections.append({
            "label": label,
            "confidence": float(conf),
            "box": [x1, y1, x2, y2]
        })

        # Draw rectangle and label
        draw.rectangle([(x1, y1), (x2, y2)], outline="lime", width=2)
        text = f"{label} {conf:.2f}"

        bbox = draw.textbbox((0, 0), text, font=font)
        text_size = (bbox[2] - bbox[0], bbox[3] - bbox[1])

        text_origin = (x1, y1 - text_size[1]) if (y1 - text_size[1] > 0) else (x1, y1 + 2)
        draw.rectangle(
            [text_origin, (text_origin[0] + text_size[0], text_origin[1] + text_size[1])],
            fill="lime"
        )
        draw.text(text_origin, text, fill="black", font=font)

    # Encode annotated image as base64
    buffered = io.BytesIO()
    img_draw.save(buffered, format="JPEG")
    encoded_image = base64.b64encode(buffered.getvalue()).decode("utf-8")

    return {"detections": detections, "annotated_image": encoded_image}


def _sync_infer(image: Image.Image):
    """
    Synchronous inference helper (runs Ultralytics model)
    """
    results = model.predict(source=image, imgsz=640, conf=DEFAULT_CONF, iou=DEFAULT_IOU)
    return results


async def run_inference(image: Image.Image, conf_threshold: float = 0.25):
    """
    Async wrapper: runs blocking inference in background thread and postprocess results.
    Returns dictionary: {"status": "success", "detections": [...], "annotated_image": "<base64 str>"}
    """
    results = await asyncio.to_thread(_sync_infer, image)
    processed = await asyncio.to_thread(_postprocess_and_annotate, results, image, conf_threshold)
    return {"status": "success", **processed}
