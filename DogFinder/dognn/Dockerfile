
FROM pytorch/pytorch:1.12.0-cuda11.3-cudnn8-runtime

WORKDIR /app

COPY . /app

RUN echo "kernel.shmmax=68719476736" >> /etc/sysctl.conf && sysctl -p

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends tzdata && \
    apt-get install -y ffmpeg libsm6 libxext6 git && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir easydict mxnet scikit-learn timm tensorboard scipy==1.7.3 && \
    pip install --no-cache-dir opencv-python-headless==4.5.5.64 pandas==1.3.5 && \
    pip install --no-cache-dir seaborn matplotlib && \
    pip install --no-cache-dir git+https://github.com/openai/CLIP.git

RUN pip install --no-cache-dir -r requirements.txt


ENV NAME World

CMD ["flask", "run", "--host=0.0.0.0","--debug"]
