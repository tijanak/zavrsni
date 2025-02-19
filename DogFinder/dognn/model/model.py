import torch
from .resnet import r18
import torch.nn.functional as F
device='cuda' if torch.cuda.is_available() else 'cpu'

class Model(torch.nn.Module):
    def __init__(self):
        super().__init__()
        self.model = r18()
        self.model.load_state_dict(torch.load("model/r18_trained.pt", map_location='cpu')['state_dict_backbone'])
        self.model = self.model.to(device)
        self.model.eval()

    def predict(self, img):
        if(torch.cuda.is_available()):
          torch.cuda.empty_cache()
        with torch.no_grad():
            img = img.to(device)
            return self.model(img.unsqueeze(0)).flatten()

