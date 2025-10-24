from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from app.services.yolo_service import run_inference
import io
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
