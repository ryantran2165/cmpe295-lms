from ultralytics import YOLO
from pprint import pprint
import cv2

if __name__ == '__main__':
    model = YOLO("yolov8n.pt")
    results = model("https://ultralytics.com/images/bus.jpg")

    print('========== MODEL DIR ==========')
    pprint(dir(model))

    print('========== PREDICTOR DIR ==========')
    pprint(dir(model.predictor))

    print('========== ANNOTATOR DIR ==========')
    pprint(dir(model.predictor.annotator))

    print('========== RESULTS DIR ==========')
    pprint(dir(results))

    print('========== MODEL ==========')
    print(model)

    print('========== PREDICTOR ==========')
    print(model.predictor)

    print('========== ANNOTATOR ==========')
    print(model.predictor.annotator)

    print('========== RESULTS ==========')
    print(results)

    im = cv2.imread('bus.jpg')

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

    cv2.imwrite('result.jpg', im)
