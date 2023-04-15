import cv2
import numpy as np
import torch
from torch import nn

classifier_name = "emnistbalanced_mathsymbols_custom"

# math_symbols = ["-", "(", ")", ",", "[", "]", "+", "=", "forward_slash", "gt", "lt", "times"]
math_symbols = ["gt"]

custom_symbols = ["colon"]

class_names = []

if "mnist" in classifier_name:
    class_names += [str(num) for num in range(10)]

if "emnist" in classifier_name:
    class_names += [chr(capital) for capital in range(ord("A"), ord("Z") + 1)]
    class_names += [chr(lower) for lower in range(ord("a"), ord("z") + 1)]

if "balanced" in classifier_name:
    class_names = [
        x
        for x in class_names
        if x not in {"c", "i", "j", "k", "l", "m", "o", "p", "s", "u", "v", "w", "x", "y", "z"}
    ]

if "symbols" in classifier_name:
    class_names += math_symbols

if "custom" in classifier_name:
    class_names += custom_symbols

n_classes = len(class_names)

class_names_map = {"gt": ">", "colon": ":"}


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


def intersects(a, b, min_area_percent=0):
    x1, y1, x2, y2 = a
    x3, y3, x4, y4 = b
    x_overlap = max(0, min(x2, x4) - max(x1, x3))
    y_overlap = max(0, min(y2, y4) - max(y1, y3))
    overlap_area = x_overlap * y_overlap
    area1 = (x2 - x1) * (y2 - y1)
    area2 = (x4 - x3) * (y4 - y3)
    return overlap_area > min_area_percent * min(area1, area2)


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
                if intersects(rects[i], rects[j], 0.9):
                    hasMerge = True
                    rects[i] = merge(rects[i], rects[j])
                    del rects[j]
                else:
                    j += 1
            i += 1


def merge_noncontinuous(rects):
    avg_width = sum(x2 - x1 for (x1, y1, x2, y2) in rects) / len(rects)
    avg_height = sum(y2 - y1 for (x1, y1, x2, y2) in rects) / len(rects)
    avg_dst = np.sqrt(avg_width**2 + avg_height**2)
    print("avg dims:", avg_width, avg_height)

    hasMerge = True
    while hasMerge:
        hasMerge = False
        i = 0
        while i < len(rects) - 1:
            x1, y1, x2, y2 = rects[i]
            cx1 = (x1 + x2) / 2
            cy1 = (y1 + y2) / 2
            j = i + 1
            while j < len(rects):
                x3, y3, x4, y4 = rects[j]
                cx2 = (x3 + x4) / 2
                cy2 = (y3 + y4) / 2
                dst = np.sqrt((cx1 - cx2) ** 2 + (cy1 - cy2) ** 2)
                if ((y2 < y3) or (y4 < y1)) and dst < 1.0 * avg_dst:
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
    # name = "sharpie"
    name = "simple_if"
    # name = "smallest_even_multiple_gray"

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

    # Merge and clean intersecting rectangles, filter by area, and sort by horizontal position
    merge_all(rects)
    rects = filter_rects(rects, min_area, max_area)
    rects.sort(key=lambda rect: rect[0])

    # Non-continuous characters: i, j, :, and =
    merge_noncontinuous(rects)

    # Periods and commas: . and ,

    # Quotation marks: ' and "

    # Draw bounding boxes
    for x1, y1, x2, y2 in rects:
        cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
    cv2.imwrite(f"{name}_boxes.jpg", img)

    # Inference
    rect_preds = []
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Using {device} device")
    model = CNN()
    model.load_state_dict(torch.load(f"model_{classifier_name}.pth"))
    model = model.to(device)
    model.eval()
    with torch.no_grad():
        for i, (x1, y1, x2, y2) in enumerate(rects):
            # Get region of interest from grayscale image
            roi = gray[y1:y2, x1:x2]

            # Flip black and white
            flipped = cv2.bitwise_not(roi)

            # Ensure black background
            flipped[flipped < 85] = 0

            # Gaussian blur
            blurred = cv2.GaussianBlur(flipped, ksize=(3, 3), sigmaX=1, sigmaY=1)

            # Resize, maintain aspect ratio, shrink larger dimension to 24 pixels
            resize_size = 24
            width = x2 - x1
            height = y2 - y1
            if width > height:
                new_width = resize_size
                new_height = int(new_width * (height / width))
            else:
                new_height = resize_size
                new_width = int(new_height * (width / height))
            resized = cv2.resize(blurred, (new_width, new_height), interpolation=cv2.INTER_CUBIC)

            # Add 2 pixel black padding
            pad_size = 28
            padded = np.zeros((pad_size, pad_size))
            x_start = pad_size // 2 - new_width // 2
            x_end = x_start + new_width
            y_start = pad_size // 2 - new_height // 2
            y_end = y_start + new_height
            padded[y_start:y_end, x_start:x_end] = resized

            # Normalize
            normalized = padded / 255

            # Convert to tensor
            tensor = (
                torch.from_numpy(normalized.astype("float32")).unsqueeze(0).unsqueeze(0).to(device)
            )

            # Predict
            pred = model(tensor)
            class_name = class_names[pred[0].argmax(0)]
            rect_preds.append((x1, y1, x2, y2, class_name))

            print("Predicted:", class_name)
            cv2.imwrite(f"preds/{i}_{class_name}.jpg", padded)

    avg_width = sum(x2 - x1 for (x1, y1, x2, y2, class_name) in rect_preds) / len(rect_preds)
    avg_height = sum(y2 - y1 for (x1, y1, x2, y2, class_name) in rect_preds) / len(rect_preds)

    # Split into lines
    lines = []
    for rect_pred in rect_preds:
        x1, y1, x2, y2, class_name = rect_pred
        cy = (y1 + y2) / 2
        found = False
        for line in lines:
            cy_avg = line[0] / (len(line) - 1)
            if np.abs(cy - cy_avg) < avg_height:
                line[0] += cy
                line.append(rect_pred)
                found = True
                break
        if not found:
            lines.append([cy, rect_pred])

    # Sort by ascending average center y
    lines.sort(key=lambda line: line[0] / (len(line) - 1))

    # Convert to string with indentation
    line_strs = []
    indents = {}
    cur_indent = 0
    for line in lines:
        line_str = []

        # Indentation
        x1, y1, x2, y2, class_name = line[1]
        first_xc = x2 - x1
        found_indent = None
        for xc, indent in indents.items():
            if np.abs(first_xc - xc) < avg_width:
                found_indent = indent
                break
        if found_indent is None:
            indents[first_xc] = cur_indent
        line_str += ["\t"] * cur_indent

        # Current line starts a new block
        if line[-1][-1] == ":":
            cur_indent += 1

        # Convert to class name strings
        for x1, y1, x2, y2, class_name in line[1:]:
            if class_name in class_names_map:
                class_name = class_names_map[class_name]
            line_str.append(class_name)

        line_strs.append("".join(line_str).lower())

    # Split lines into tokens (add spaces)

    # Fix basic rules (capitalization)
    print("========================================")
    for line_str in line_strs:
        print(line_str)


if __name__ == "__main__":
    main()
