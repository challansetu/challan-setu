FROM python:3.11-slim

# ddddocr (OpenCV) needs these native libs
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install only scraper API deps (not bot/test deps)
RUN pip install --no-cache-dir \
    httpx>=0.27.0 \
    python-dotenv==1.0.1 \
    fastapi==0.111.0 \
    "uvicorn[standard]==0.30.1" \
    pycryptodome>=3.20.0 \
    "ddddocr>=1.4.11"

COPY scrapers/ ./scrapers/
COPY scraper_api.py ./
COPY config.py ./

EXPOSE 8001

CMD ["python", "scraper_api.py"]
