import os
import py_compile

import cv2
import numpy as np
import requests
import torch
from flask import Flask, request
from torch import nn

CLASSIFIER_NAME = "emnistbalanced_mathsymbols_custom"
# MATH_SYMBOLS = ["-", "(", ")", ",", "[", "]", "+", "=", "forward_slash", "gt", "lt", "times"]
MATH_SYMBOLS = ["gt"]
CUSTOM_SYMBOLS = ["colon"]
CLASS_NAMES = []
if "mnist" in CLASSIFIER_NAME:
    CLASS_NAMES += [str(num) for num in range(10)]
if "emnist" in CLASSIFIER_NAME:
    CLASS_NAMES += [chr(capital) for capital in range(ord("A"), ord("Z") + 1)]
    CLASS_NAMES += [chr(lower) for lower in range(ord("a"), ord("z") + 1)]
if "balanced" in CLASSIFIER_NAME:
    CLASS_NAMES = [
        x
        for x in CLASS_NAMES
        if x not in {"c", "i", "j", "k", "l", "m", "o", "p", "s", "u", "v", "w", "x", "y", "z"}
    ]
if "symbols" in CLASSIFIER_NAME:
    CLASS_NAMES += MATH_SYMBOLS
if "custom" in CLASSIFIER_NAME:
    CLASS_NAMES += CUSTOM_SYMBOLS
N_CLASSES = len(CLASS_NAMES)
CLASS_NAMES_MAP = {"gt": ">", "colon": ":"}


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
            nn.Linear(in_features=128, out_features=N_CLASSES),
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


app = Flask(__name__)


@app.route("/parse", methods=["POST"])
def parse():
    # Get image URL from request body
    json = request.get_json()
    url = json["url"]
    print(url)

    # name = "simple_if"
    # img = cv2.imread(f"{name}.jpg")

    # Get image from S3
    res = requests.get(url, stream=True).raw
    img = np.asarray(bytearray(res.read()), dtype="uint8")
    img = cv2.imdecode(img, cv2.IMREAD_COLOR)

    # Grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    # cv2.imwrite(f"{name}_gray.jpg", gray)

    # Canny
    canny = cv2.Canny(gray, 100, 200)
    # cv2.imwrite(f"{name}_canny.jpg", canny)

    # Contours
    contours, _ = cv2.findContours(canny, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Draw contours
    canny = cv2.cvtColor(canny, cv2.COLOR_GRAY2BGR)
    cv2.drawContours(canny, contours, -1, (255, 255, 255), 5)
    # cv2.imwrite(f"{name}_contours.jpg", canny)

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
    # cv2.imwrite(f"{name}_boxes.jpg", img)

    # Inference
    rect_preds = []
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"DEVICe:", device)
    model = CNN()
    model.load_state_dict(torch.load(f"model_{CLASSIFIER_NAME}.pth"))
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
            class_name = CLASS_NAMES[pred[0].argmax(0)]
            rect_preds.append((x1, y1, x2, y2, class_name))

            # cv2.imwrite(f"preds/{i}_{class_name}.jpg", padded)

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
    for i, line in enumerate(lines):
        line_str = []

        # Indentation
        x1 = line[1][0]
        if i == 0:
            # First line
            indents[x1] = 0
        else:
            # Previous line ends with colon, starting new indent block
            if lines[i - 1][-1][-1] == "colon":
                cur_indent += 1
                indents[x1] = cur_indent
            else:
                # Find closest indent
                min_dst = float("inf")
                for x, indent in indents.items():
                    dst = np.abs(x1 - x)
                    if dst < min_dst:
                        min_dst = dst
                        cur_indent = indent

        rect_preds = line[1:]

        # Spaces and convert class name strings
        tokens = []
        for i, (x1, y1, x2, y2, class_name) in enumerate(rect_preds):
            # Add space
            if i > 0:
                prev_x2 = rect_preds[i - 1][2]
                dx = x1 - prev_x2
                if dx > 0.75 * avg_width:
                    tokens.append(" ")

            # Convert class name if exists
            if class_name in CLASS_NAMES_MAP:
                class_name = CLASS_NAMES_MAP[class_name]

            tokens.append(class_name)

        # Split into tokens
        tokens = "".join(tokens).lower().split(" ")

        # Fix basic rules (capitalization)
        for i, token in enumerate(tokens):
            if token == "true":
                tokens[i] = "True"
            elif token == "false":
                tokens[i] = "False"
            if token == "jf":
                tokens[i] = "if"

        # Add indentation and join tokens with space
        line_str = ("    " * cur_indent) + " ".join(tokens)
        line_strs.append(line_str)

    # Join all lines into one string
    final_str = "\n".join(line_strs)
    print(final_str)

    return final_str


@app.route("/repair", methods=["POST"])
def repair():
    # Get code from request body
    json = request.get_json()
    code = json["code"]
    print("BEFORE:")
    print(code)

    # Write temporary file
    temp_file = "temp.py"
    with open(temp_file, "w") as f:
        f.write(code)

    try:
        # Try compiling
        py_compile.compile(temp_file, doraise=True)

        # Already valid, don't need to do anything
        print("VALID")
    except py_compile.PyCompileError:
        # Invalid, try Break-It-Fix-It
        print("INVALID")

    # Delete temporary file
    os.remove(temp_file)

    print("AFTER:")
    print(code)
    return code


@app.route("/grade", methods=["POST"])
def grade():
    # Get code and test cases from request body
    json = request.get_json()
    code = json["code"]
    test_cases = json["testCases"]

    print(code)
    print(test_cases)

    valid = True
    passed = 0
    failed = 0
    errors = ""
    response = {"valid": valid, "passed": passed, "failed": failed, "errors": errors}
    return response
