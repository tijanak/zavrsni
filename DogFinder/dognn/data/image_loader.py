from PIL import Image
from torchvision import transforms
class ImageLoader:
    def __init__(self):
        self.transform = transforms.Compose([
            # transforms.RandomHorizontalFlip(),
            # transforms.Resize(224),
            transforms.ToTensor(),
            transforms.Normalize(mean=(0.485, 0.456, 0.406), std=(0.229, 0.224, 0.225)),
        ])

    def load_img(self, img):
        return self.transform(Image.open(img).convert('RGB'))
