# 🍅 Kanjuku Tomato AI — Backend

## 🧠 Project Overview
**Kanjuku Tomato AI** is a deep learning–powered backend built with **FastAPI** that detects **ripe** and **unripe tomatoes** using a trained **YOLOv8** model.  
It provides two inference APIs:
- `/api/predict` → Returns **JSON detections** + a **base64 encoded annotated image**
- `/api/predict/image` → Returns the **annotated image directly**

This backend is designed for **easy integration** with web dashboards, IoT devices, or farm automation systems.

---

## ⚙️ Tech Stack
| Category | Technology |
|-----------|-------------|
| **Language** | Python 3.10+ |
| **Framework** | FastAPI |
| **Deep Learning** | Ultralytics YOLOv8 |
| **Image Handling** | Pillow (PIL), NumPy |
| **Model Backend** | PyTorch / ONNX Runtime |
| **Server** | Uvicorn (ASGI) |
| **Environment Config** | python-dotenv |
| **Testing Tools** | Postman / Thunder Client |
| **Containerization (Optional)** | Docker |

---

## 🗂️ Folder Structure

```

backend/
├── app/
│ ├── init.py
│ ├── main.py # FastAPI app entrypoint
│ ├── core/
│ │ └── config.py # Environment config loader
│ ├── routes/
│ │ └── predict.py # Defines /api/predict endpoints
│ ├── services/
│ │ └── yolo_service.py # YOLO model loading + inference
│ ├── model/
│ │ └── best.pt # YOLOv8 model weights
│ └── utils/
│ └── image_utils.py # Optional helpers (drawing, scaling)
├── requirements.txt
├── Dockerfile
├── .env
└── README.md

```

## 🧩 Features

- ✅ **YOLOv8 model integration** for object detection.
- 🎨 **Annotated output images** with bounding boxes.
- 🌈 **Color-coded boxes:**  
  - Green → Ripe  
  - Blue → Unripe  
- 🔠 **Adaptive font & box scaling** according to image size.
- ⚡ **Asynchronous inference** for non-blocking performance.
- 🔒 **CORS enabled** for frontend communication.
- 🧪 **Easily testable** via Postman, Thunder Client, or curl.
- 🐳 **Docker-ready** for production deployment.

---

## 🧰 Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/kanjuku-tomato-backend.git
cd kanjuku-tomato-backend

2️⃣ Create Virtual Environment

python3 -m venv .venv
source .venv/bin/activate       # Linux / macOS
# .venv\Scripts\Activate.ps1    # Windows (PowerShell)

3️⃣ Upgrade pip

pip install --upgrade pip

4️⃣ Install Dependencies

pip install -r requirements.txt

If you get a “no space left on device” error:

mkdir -p ~/pip_tmp
export TMPDIR=~/pip_tmp
pip install -r requirements.txt

5️⃣ Place Your Model File

Put your trained YOLO model (best.pt) inside:

app/model/best.pt

6️⃣ Environment Variables (.env)

Create a .env file in the project root:

MODEL_PATH=app/model/best.pt
PORT=5000

🚀 Running the Backend

Start the server with:

uvicorn app.main:app --host 0.0.0.0 --port 5000 --reload

Server output should show:

Uvicorn running on http://0.0.0.0:5000

Now open your browser:

http://127.0.0.1:5000

You should see:

{"message": "Backend is alive"}




📡 API Endpoints
1️⃣ Health Check

GET /

Response:

{"message": "Backend is alive"}

2️⃣ Predict (JSON + Base64 Image)

POST /api/predict
Request:

    Type: multipart/form-data

    Field: file → image file (jpg/png)

Response:

{
  "status": "success",
  "detections": [
    {
      "label": "ripe",
      "confidence": 0.92,
      "box": [x1, y1, x2, y2]
    },
    {
      "label": "unripe",
      "confidence": 0.84,
      "box": [x1, y1, x2, y2]
    }
  ],
  "annotated_image": "<base64-encoded-image>"
}

Example curl command:

curl -X POST "http://127.0.0.1:5000/api/predict" \
     -F "file=@/path/to/tomato.jpg" \
     -H "Accept: application/json"

Decode image from response:

curl -s -X POST "http://127.0.0.1:5000/api/predict" -F "file=@tomato.jpg" \
| jq -r '.annotated_image' | base64 --decode > annotated.jpg

3️⃣ Predict (Direct Annotated Image)

POST /api/predict/image
Request:

    Type: multipart/form-data

    Field: file → image file

Response:

    Returns a binary JPEG image directly (not JSON).

Example curl command:

curl -X POST "http://127.0.0.1:5000/api/predict/image" \
     -F "file=@/path/to/tomato.jpg" \
     --output annotated.jpg

🧪 Testing in Postman / Thunder Client
🔹 Postman

    Set request type to POST.

    URL: http://127.0.0.1:5000/api/predict or /api/predict/image.

    In the Body tab → choose form-data.

    Add field:

    Key: file
    Type: File
    Value: choose your image

    Click Send.

    For /api/predict → view JSON output.

    For /api/predict/image → click Send and Download to save image.

🔹 Thunder Client (VS Code Extension)

    Create new request.

    Method: POST
    URL: http://127.0.0.1:5000/api/predict/image

    Add body → form-data → file

    Upload an image.

    Send request.

    Use “Download Response” to save the result.

🧯 Troubleshooting
Issue	Fix
404 Not Found	Make sure route is /api/predict and server is running on same port
Form data requires "python-multipart"	Install with pip install python-multipart
No space left on device	Use TMPDIR=~/pip_tmp pip install ...
Invalid image	Ensure file is a valid JPG/PNG
Bounding boxes too small	Adjust scaling logic or resolution in YOLO model
Wrong colors	Make sure yolo_service.py defines blue for unripe and green for ripe
🐳 Docker Deployment (Optional)
Build Image

docker build -t tomato-backend:latest .

Run Container

docker run -d -p 80:5000 --name tomato-backend tomato-backend:latest

If model not inside image:

docker run -d -p 80:5000 \
  -v $(pwd)/app/model/best.pt:/app/app/model/best.pt \
  tomato-backend:latest

Then open:
👉 http://localhost/api/predict
☁️ EC2 Deployment (Quick Guide)

    Launch EC2 (Ubuntu 22.04) and open ports 22 and 80.

    SSH into instance.

    Install Docker:

sudo apt update && sudo apt install docker.io -y

Clone repo:

git clone <repo-url> && cd kanjuku-tomato-backend

Copy your best.pt file to app/model/.

Build and run:

    sudo docker build -t tomato-ai .
    sudo docker run -d -p 80:5000 tomato-ai

    Visit: http://<EC2-PUBLIC-IP>/

🔒 Security Notes

    Restrict CORS origins in production (allow_origins=["https://your-frontend.com"]).

    Don’t expose model weights publicly.

    Use HTTPS and API authentication if deployed online.

    For GPU-based inference, use EC2 g4dn or AWS SageMaker.

💡 Future Improvements

    Add Redis caching for recent predictions.

    Build frontend dashboard (React/Next.js + Tailwind).

    Add JWT authentication for API users.

    Integrate S3 / Cloud Storage for saving predictions.

    Implement batch inference support.

👨‍💻 Author

Vineet Salve & Sai Vijay Chandan R
Backend Developer | Golang & Python Enthusiast
📧 Contact for Collaboration
🏁 License

This project is licensed under the MIT License.
You’re free to use, modify, and distribute it with attribution.
⭐ If you find this project useful, consider starring the repo!


---
