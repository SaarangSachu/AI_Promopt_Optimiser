# Use Python
FROM python:3.9

# Set working directory
WORKDIR /app

# Copy requirements
COPY backend/requirements.txt .

# Install dependencies
# We use the CPU version of Torch to make it faster, even though HF has plenty of RAM
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir torch==2.2.0+cpu --extra-index-url https://download.pytorch.org/whl/cpu
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend code
COPY backend .

# Create a folder for secrets
RUN mkdir -p /etc/secrets

# Start the app on port 7860 (Hugging Face default)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]