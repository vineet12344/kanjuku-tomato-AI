from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from app.services.yolo_service import run_inference
import io
from fastapi.responses import StreamingResponse
import base64
from PIL import Image

router = APIRouter()

@router.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Accepts file upload (form-data file field).
    Returns JSON with detections and an optional base64-encoded annotated image.
    """
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")

    contents = await file.read()
    try:
        img = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image: {e}")

    result = await run_inference(img)

    return JSONResponse(content=result)

@router.post("/predict/image")
async def predict_image(file: UploadFile = File(...)):
    """
    Returns annotated image directly (for browser or frontend display).
    """
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")

    contents = await file.read()
    try:
        img = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image: {e}")

    result = await run_inference(img)

    # Decode base64 back into bytes and stream as an image
    image_data = base64.b64decode(result["annotated_image"])
    return StreamingResponse(io.BytesIO(image_data), media_type="image/jpeg")
