
import keras_cv
import cv2
import numpy as np
import tensorflow as tf



def load_image(img_rgb, target_size=(640, 640)):
    img_resized = cv2.resize(img_rgb, target_size)
    img_tensor = tf.convert_to_tensor(img_resized, dtype=tf.float32)

    return img_tensor, img_rgb, img_rgb.shape

backbone = keras_cv.models.YOLOV8Backbone.from_preset(
    "yolo_v8_s_backbone_coco", include_rescaling=True
)
model = keras_cv.models.YOLOV8Detector(
    num_classes=1,
    bounding_box_format="xyxy",
    backbone=backbone,
    fpn_depth=5,
    max_feature_dimensions=512
)
model.load_weights("yolo_dog_face_detection.weights.h5")
def process_image(image):

  img_tensor, img_rgb, original_size = load_image(image)

  results = model.predict(img_tensor[None, ...])

  original_height, original_width, _ = original_size
  target_height, target_width = 640, 640
  scale_x = original_width / target_width
  scale_y = original_height / target_height
  dogs=[]
  if results['num_detections'][0]==0:
      dogs.append([0,0,original_width,original_height])
  for i in range(results['num_detections'][0]):
        if results['classes'][0][i] == 0:
            box = results['boxes'][0][i]

            x1, y1, x2, y2 = map(int, box)
            x1 = int(x1 * scale_x)
            y1 = int(y1 * scale_y)
            x2 = int(x2 * scale_x)
            y2 = int(y2 * scale_y)

            dogs.append([x1,y1,x2,y2])
  return dogs

