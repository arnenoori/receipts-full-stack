from fastapi import FastAPI, exceptions, File, UploadFile
from fastapi.responses import JSONResponse
from pydantic import ValidationError
from src.api import transactions, admin, auth, users, purchases
import json
import logging
import boto3
import requests
import os
from starlette.middleware.cors import CORSMiddleware

description = """
Receipt App
"""

app = FastAPI(
    title="Receipt App",
    description=description,
    version="0.0.1",
    terms_of_service="http://example.com/terms/",
    contact={
        "name": "Students",
        "email": "agnoori@calpoly.edu",
    },
)

s3 = boto3.client('s3', aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'), aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'))

@app.post("/upload_receipt")
async def upload_receipt(file: UploadFile = File(...)):
    s3.upload_fileobj(file.file, os.getenv('AWS_S3_BUCKET_NAME'), f'receipts/{file.filename}')
    image_url = f'https://{os.getenv("AWS_S3_BUCKET_NAME")}.s3.amazonaws.com/receipts/{file.filename}'
    receipt_data = process_receipt(image_url)
    # TODO: Store receipt_data in your database
    return {"image_url": image_url, "receipt_data": receipt_data}

def process_receipt(image_url):
    api_key = os.getenv('OPENAI_API_KEY')
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    payload = {
        "model": "gpt-4-vision-preview",
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "What’s in this image?"
                    },
                    {
                        "type": "image_url",
                        "image_url": image_url
                    }
                ]
            }
        ],
        "max_tokens": 300
    }
    response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
    return response.json()

@app.get("/user/{user_id}/receipts")
async def get_receipts(user_id: int):
    # TODO: Retrieve receipt data for the user from your database
    return {"receipts": []}

app.include_router(transactions.router)
app.include_router(users.router)
app.include_router(purchases.router)
app.include_router(admin.router)

@app.exception_handler(exceptions.RequestValidationError)
@app.exception_handler(ValidationError)
async def validation_exception_handler(request, exc):
    logging.error(f"The client sent invalid data!: {exc}")
    exc_json = json.loads(exc.json())
    response = {"message": [], "data": None}
    for error in exc_json:
        response['message'].append(f"{error['loc']}: {error['msg']}")

    return JSONResponse(response, status_code=422)

@app.get("/")
async def root():
    return {"message": "Welcome to our Receipt App Backend."}