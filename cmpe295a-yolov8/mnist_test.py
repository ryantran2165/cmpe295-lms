from ultralytics import YOLO
import cv2

if __name__ == '__main__':
    model = YOLO("runs/detect/train11/weights/best.pt")
    file = '0_9_thin.jpg'
    im = cv2.imread(file)
    results = model(im)
    for i, result in enumerate(results):
        xyxy = result.boxes.xyxy.cpu().numpy().astype(int)
        classes = result.boxes.cls.cpu().numpy().astype(int)
        confs = result.boxes.conf.cpu().numpy()
        for i in range(len(classes)):
            x1, y1, x2, y2 = xyxy[i]
            name = model.names[classes[i]]
            conf = int(confs[i] * 100)
            cv2.rectangle(im, (x1, y1), (x2, y2), (0, 0, 255), 1)
            cv2.putText(im, f'{name},{conf}', (x1 + 10, y1 + 20), cv2.FONT_HERSHEY_SIMPLEX, 0.75, (0, 0, 255), 1, cv2.LINE_AA)
    cv2.imwrite(f'result_{file}', im)
