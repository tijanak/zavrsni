import torch
from .resnet import r50
import torch.nn.functional as F
device='cuda' if torch.cuda.is_available() else 'cpu'

class ArcFace(torch.nn.Module):
    def __init__(self):
        super().__init__()
        self.arcface = r50()
        self.arcface.load_state_dict(torch.load("model/weights.pt", map_location='cpu')['state_dict_backbone'])
        self.arcface = self.arcface.to(device)
        self.arcface.eval()

    def predict(self, img):
        torch.cuda.empty_cache()        
        with torch.no_grad():
            img = img.to(device)
            return F.normalize(self.arcface(img.unsqueeze(0))).flatten()
