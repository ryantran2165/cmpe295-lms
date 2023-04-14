import cv2
import numpy as np
import torch
from torch import nn

# math_symbols = ["-", "(", ")", ",", "[", "]", "+", "=", "forward_slash", "gt", "lt", "times"]
math_symbols = ["-", "+", "=", "forward_slash", "gt", "lt", "times"]
class_names = (
    [str(num) for num in range(10)]
    + [chr(capital) for capital in range(ord("A"), ord("Z") + 1)]
    + [chr(lower) for lower in range(ord("a"), ord("z") + 1)]
    + math_symbols
)
n_classes = len(class_names)


class CNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(in_channels=1, out_channels=32, kernel_size=3),
            nn.ReLU(),
            nn.BatchNorm2d(num_features=32),
            nn.Conv2d(in_channels=32, out_channels=32, kernel_size=3),
            nn.ReLU(),
            nn.BatchNorm2d(num_features=32),
            nn.Conv2d(in_channels=32, out_channels=32, kernel_size=5, stride=1, padding="same"),
            nn.ReLU(),
            nn.BatchNorm2d(num_features=32),
            nn.Dropout(p=0.4),
            nn.Conv2d(in_channels=32, out_channels=64, kernel_size=3),
            nn.ReLU(),
            nn.BatchNorm2d(num_features=64),
            nn.Conv2d(in_channels=64, out_channels=64, kernel_size=3),
            nn.ReLU(),
            nn.BatchNorm2d(num_features=64),
            nn.Conv2d(in_channels=64, out_channels=64, kernel_size=5, stride=1, padding="same"),
            nn.ReLU(),
            nn.BatchNorm2d(num_features=64),
        )
        self.classifier = nn.Sequential(
            nn.Dropout(p=0.4),
            nn.Linear(in_features=64 * 20 * 20, out_features=128),
            nn.ReLU(),
            nn.BatchNorm1d(num_features=128),
            nn.Dropout(p=0.4),
            nn.Linear(in_features=128, out_features=n_classes),
        )

    def forward(self, x):
        out = self.features(x)
        out = out.view(out.size(0), -1)
        out = self.classifier(out)
        return out


def intersects(a, b):
    x1, y1, x2, y2 = a
    x3, y3, x4, y4 = b
    x_overlap = max(0, min(x2, x4) - max(x1, x3))
    y_overlap = max(0, min(y2, y4) - max(y1, y3))
    overlap_area = x_overlap * y_overlap
    area1 = (x2 - x1) * (y2 - y1)
    area2 = (x4 - x3) * (y4 - y3)
    return overlap_area > 0.9 * min(area1, area2)


def merge(a, b):
    x1 = min(a[0], b[0])
    y1 = min(a[1], b[1])
    x2 = max(a[2], b[2])
    y2 = max(a[3], b[3])
    return (x1, y1, x2, y2)


def merge_all(rects):
    hasMerge = True
    while hasMerge:
        hasMerge = False
        i = 0
        while i < len(rects) - 1:
            j = i + 1
            while j < len(rects):
                if intersects(rects[i], rects[j]):
                    hasMerge = True
                    rects[i] = merge(rects[i], rects[j])
                    del rects[j]
                else:
                    j += 1
            i += 1


def filter_rects(rects, min_area, max_area):
    filtered = []
    for x1, y1, x2, y2 in rects:
        w = x2 - x1
        h = y2 - y1
        a = w * h
        if a < min_area or a > max_area:
            continue
        filtered.append((x1, y1, x2, y2))
    return filtered


def main():
    name = "simple_if"

    img = cv2.imread(f"{name}.jpg")

    # Grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    cv2.imwrite(f"{name}_gray.jpg", gray)

    # Canny
    canny = cv2.Canny(gray, 100, 200)
    cv2.imwrite(f"{name}_canny.jpg", canny)

    # Contours
    contours, _ = cv2.findContours(canny, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Draw contours
    canny = cv2.cvtColor(canny, cv2.COLOR_GRAY2BGR)
    cv2.drawContours(canny, contours, -1, (255, 255, 255), 5)
    cv2.imwrite(f"{name}_contours.jpg", canny)

    # Bounding boxes
    rects = []
    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)
        x1 = x
        y1 = y
        x2 = x + w
        y2 = y + h
        rects.append((x1, y1, x2, y2))

    # Min area relative to max area found
    max_a = 0
    for x1, y1, x2, y2 in rects:
        a = (x2 - x1) * (y2 - y1)
        max_a = max(max_a, a)
    min_area = max_a * 0.005
    max_area = 100000

    # Merge intersecting rectangles, filter, and sort by horizontal position
    merge_all(rects)
    rects = filter_rects(rects, min_area, max_area)
    rects.sort(key=lambda rect: rect[0])

    # Draw bounding boxes
    for x1, y1, x2, y2 in rects:
        cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
    cv2.imwrite(f"{name}_boxes.jpg", img)

    device = (
        "cuda"
        if torch.cuda.is_available()
        else "mps"
        if torch.backends.mps.is_available()
        else "cpu"
    )
    print(f"Using {device} device")
    model = CNN()
    model.load_state_dict(torch.load("model_emnistbyclass_mathsymbols.pth"))
    model = model.to(device)
    model.eval()
    with torch.no_grad():
        for i, (x1, y1, x2, y2) in enumerate(rects):
            # Get region of interest from grayscale image
            roi = gray[y1:y2, x1:x2]

            # Resize, maintain aspect ratio, shrink larger dimension to 20 pixels
            resize_size = 20
            width = x2 - x1
            height = y2 - y1
            if width > height:
                new_width = resize_size
                new_height = int(new_width * (height / width))
            else:
                new_height = resize_size
                new_width = int(new_height * (width / height))
            resized = cv2.resize(roi, (new_width, new_height))

            # Flip black and white
            flipped = cv2.bitwise_not(resized)

            # Ensure black background
            flipped[flipped < 85] = 0

            # Add black padding border
            pad_size = 28
            padded = np.zeros((pad_size, pad_size))
            x_start = pad_size // 2 - new_width // 2
            x_end = x_start + new_width
            y_start = pad_size // 2 - new_height // 2
            y_end = y_start + new_height
            padded[y_start:y_end, x_start:x_end] = flipped

            # Noramlize
            normalized = padded / 255

            # Keep only the largest continuous stroke, but that messes with letters like 'i'

            # Convert to tensor
            tensor = (
                torch.from_numpy(normalized.astype("float32")).unsqueeze(0).unsqueeze(0).to(device)
            )

            # Predit
            pred = model(tensor)
            pred = class_names[pred[0].argmax(0)]
            print("Predicted:", pred)

            cv2.imwrite(f"preds/roi_{i}_{pred}.jpg", padded)


if __name__ == "__main__":
    main()
