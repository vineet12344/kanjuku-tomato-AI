from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import predict

app = FastAPI(title="Kanjuku Tomato AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrict this to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Backend is alive"}