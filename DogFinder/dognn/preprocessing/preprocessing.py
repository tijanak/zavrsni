import requests
import cv2
import numpy as np
import os
import io
from PIL import Image
from app import app
def resize_with_padding(image, target_size=(224, 224)):
    original_height, original_width = image.shape[:2]
    target_height, target_width = target_size

    scale_x = target_width / original_width
    scale_y = target_height / original_height

    scale = min(scale_x, scale_y)

    new_width = int(original_width * scale)
    new_height = int(original_height * scale)

    resized_image = cv2.resize(image, (new_width, new_height))

    padded_image = np.zeros((target_height, target_width, 3), dtype=np.uint8)

    top_left_y = (target_height - new_height) // 2
    top_left_x = (target_width - new_width) // 2

    padded_image[top_left_y:top_left_y+new_height, top_left_x:top_left_x+new_width] = resized_image

    return padded_image

def process_image(image_bytes):

    response = requests.post('http://fd:8080/process', files={'file': image_bytes})
    image=Image.open(io.BytesIO(image_bytes)).convert('RGB')
    image_np = np.array(image)

    faces=[]
    for box in response.json():
        x1, y1, x2, y2 = map(int, box)

        cropped_image = image_np[y1:y2, x1:x2]
        cropped_image = resize_with_padding(cropped_image)
        faces.append(cropped_image)
    return faces
