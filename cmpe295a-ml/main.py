import cv2
import numpy as np
from PIL import Image


def intersects(a, b):
    x1, y1, x2, y2 = a
    x3, y3, x4, y4 = b
    return (x1 < x4) and (x3 < x2) and (y1 < y4) and (y3 < y2)


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
        if a < min_area or a > max_area or w > 2 * h or h > 3 * w:
            continue
        filtered.append([x1, y1, x2, y2])
    return filtered


def main():
    name = 'thin'

    img = cv2.imread(f'{name}.jpg')

    # Grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    cv2.imwrite(f'{name}_gray.jpg', gray)

    # Canny
    canny = cv2.Canny(gray, 100, 200)
    cv2.imwrite(f'{name}_canny.jpg', canny)

    # Contours
    contours, _ = cv2.findContours(canny, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Draw contours
    canny = cv2.cvtColor(canny, cv2.COLOR_GRAY2BGR)
    cv2.drawContours(canny, contours, -1, (255, 255, 255), 5)
    cv2.imwrite(f'{name}_contours.jpg', canny)

    # min_area = 0
    # max_area = 10000

    # Bounding boxes
    rects = []
    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)
        # a = w * h
        # if a < min_area or a > max_area or w > 2 * h or h > 3 * w:
        #     continue
        x1 = x
        y1 = y
        x2 = x + w
        y2 = y + h
        rects.append((x1, y1, x2, y2))

    # Merge intersecting rectangles, filter, and sort by horizontal position
    merge_all(rects)
    # rects = filter_rects(rects, min_area, max_area)
    rects.sort(key=lambda rect: rect[0])

    # Draw bounding boxes
    for x1, y1, x2, y2 in rects:
        cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
    cv2.imwrite(f'{name}_boxes.jpg', img)


if __name__ == '__main__':
    main()
