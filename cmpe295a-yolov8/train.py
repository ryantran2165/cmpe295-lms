from ultralytics import YOLO

if __name__ == '__main__':
    model = YOLO("yolov8n.pt")
    results = model.train(
        data="./datasets/mnist/mnist.yaml",
        epochs=10,
        imgsz=640,
        batch=8,
        hsv_h=0,
        hsv_s=0,
        hsv_v=0,
        degrees=0,
        translate=0,
        scale=0,
        shear=0,
        perspective=0,
        flipud=0,
        fliplr=0,
        mosaic=0,
        mixup=0,
        copy_paste=0)
    # model.val()
