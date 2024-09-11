import cv2
import numpy as np
from rembg import remove

IMG_SIZE = 224
CASCADE_SCALE = 1.1
MIN_NEIGH = 5
def remove_background(image):
    output_image = remove(image, alpha_matting=False)
    
    if output_image.shape[2] == 4:
        rgb_image = np.zeros((output_image.shape[0], output_image.shape[1], 3), dtype=np.uint8)
        rgb_image[..., 0] = output_image[..., 0]
        rgb_image[..., 1] = output_image[..., 1]
        rgb_image[..., 2] = output_image[..., 2]
        alpha_channel = output_image[..., 3]
        mask = alpha_channel == 0
        rgb_image[mask] = 0
        return rgb_image
    else:
        return output_image
def is_gpu_available():
    return cv2.cuda.getCudaEnabledDeviceCount() > 0

def detect_faces(image,cascadexml):
    
    if is_gpu_available():
        cascade_gpu = cv2.cuda_CascadeClassifier.create(cascadexml)
        image_gpu = cv2.cuda_GpuMat()
        image_gpu.upload(image)
        objects = cascade_gpu.detectMultiScale(image_gpu, scaleFactor=CASCADE_SCALE, minNeighbors=MIN_NEIGH)
        faces = objects.download()
    else:
        cascade_cpu = cv2.CascadeClassifier(cascadexml)
        faces = cascade_cpu.detectMultiScale(image, scaleFactor=CASCADE_SCALE, minNeighbors=MIN_NEIGH)
    
    return faces
def downscale_image(img, max_dimension: int = IMG_SIZE*2):
    height, width = img.shape[:2]
    if(width>max_dimension or height>max_dimension):
        if width > height:
            scale = max_dimension / width
        else:
            scale = max_dimension / height

        new_width = int(width * scale)
        new_height = int(height * scale)
        resized_img = cv2.resize(img, (new_width, new_height), interpolation=cv2.INTER_AREA)


        return resized_img
    else:
        return img
def process_image(image):
    image=downscale_image(image)
    image = remove_background(image)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    dogs = detect_faces(gray,'./preprocessing/cascade.xml')
    areas = []

    for index, (x, y, w, h) in enumerate(dogs):
        center_x = x + w // 2
        center_y = y + h // 2

        if h < IMG_SIZE:
            w = IMG_SIZE
            h = IMG_SIZE
            x = center_x - w // 2
            y = center_y - h // 2

        pad_top = max(0, -y)
        pad_bottom = max(0, y + h - image.shape[0])
        pad_left = max(0, -x)
        pad_right = max(0, x + w - image.shape[1])
        
        padded_frame = cv2.copyMakeBorder(
            image, 
            top=pad_top, 
            bottom=pad_bottom, 
            left=pad_left, 
            right=pad_right, 
            borderType=cv2.BORDER_CONSTANT, 
            value=(0, 0, 0)
        )

        padded_x = x + pad_left
        padded_y = y + pad_top
        padded_w = w
        padded_h = h

        extracted_area = padded_frame[padded_y:padded_y + padded_h, padded_x:padded_x + padded_w]

        if h >= IMG_SIZE:
            resized_area = cv2.resize(extracted_area, (IMG_SIZE, IMG_SIZE))
        else:
            resized_area = extracted_area

        areas.append(resized_area)

    return areas