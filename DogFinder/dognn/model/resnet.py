import torch
from torch import nn
from torchvision.models import resnet50, ResNet50_Weights, resnet18, ResNet18_Weights


def r50(n_classes=512):
    weights = ResNet50_Weights.DEFAULT
    model = resnet50(weights=weights)
    model.fc = nn.Sequential(nn.Linear(model.fc.in_features, n_classes),nn.BatchNorm1d(n_classes))
    return model
def r18(n_classes=512):
    weights = ResNet18_Weights.DEFAULT
    model = resnet18(weights=weights)
    model.fc = nn.Sequential(
        nn.Dropout(p=0.5),
        nn.Linear(model.fc.in_features, n_classes),
        nn.BatchNorm1d(n_classes)
    )
    return model
