from fastapi import FastAPI, HTTPException, exceptions, File, UploadFile, status
from fastapi.responses import JSONResponse
from pydantic import ValidationError
from src.api import transactions, admin, auth, users, purchases
import json
import logging
import boto3
import requests
import os
import time
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

#s3 = boto3.client('s3', aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'), aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'))
#s3 = boto3.resource('s3')

s3 = boto3.resource(
    's3',
    # region_name='your-region',  # Uncomment and set your region
    aws_access_key_id='AKIARWPUKDOPQ2WAAZHW',
    aws_secret_access_key='/OVgavy+Pi8EXzRe0f0P9Myk1aGJCyAjCRhT9icc'
)

bucket = s3.Bucket('user-receipts-upload')

async def s3_upload(contents: bytes, key: str):
    print("attempting to upload")
    bucket.put_object(Key=key, Body=contents)



KB = 1024
MB = 1024 * KB

SUPPORTED_FILES = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'application/pdf': 'pdf'
}

#had issues with magic so using this to get file type
def get_file_type(contents):
    # Common file headers (first few bytes)
    file_signatures = {
        b'\xFF\xD8\xFF\xDB': 'image/jpeg',
        b'\xFF\xD8\xFF\xE0': 'image/jpeg',
        b'\x89\x50\x4E\x47\x0D\x0A\x1A\x0A': 'image/png',
        b'\x47\x49\x46\x38\x37\x61': 'image/gif',
        b'\x47\x49\x46\x38\x39\x61': 'image/gif',
        # Add more file types as needed
    }

    # Check the first few bytes against common signatures
    for signature, file_type in file_signatures.items():
        if contents.startswith(signature):
            return file_type

    return 'unknown'


@app.post("/upload_receipt")
async def upload_receipt_to_S3(file: UploadFile = File(...)):
    if not file:
        raise HTTPException (
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='File not found'

        )
    
    contents = await file.read()
    file_size = len(contents)

    if not 0 < file_size <= 10 * MB:
        raise HTTPException (
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='File size must be between 0 and 10 MB'

        )
    
    file_type = get_file_type(contents)
    if file_type not in SUPPORTED_FILES:
        raise HTTPException (
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='file type: {file_type} not supported'
        )
    
    await s3_upload(contents=contents, key=f'{file.filename}{int(time.time())}.{SUPPORTED_FILES[file_type]}')
    
    #s3.upload_fileobj(file.file, os.getenv('AWS_S3_BUCKET_NAME'), f'receipts/{file.filename}')
    image_url = f'https://{os.getenv('AWS_S3_BUCKET_NAME')}.s3.amazonaws.com/receipts/{file.filename}/{int(time.time())}'
    #receipt_data = process_receipt(image_url)
    # TODO: Store receipt_data in your database
    return {"image_url": image_url}#, "receipt_data": receipt_data}




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