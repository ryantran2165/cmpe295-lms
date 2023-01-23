import numpy as np
import pandas as pd
import cv2

CANVAS_SHAPE = 10
ORIGINAL_SIZE = 28
RESIZE_SIZE = ORIGINAL_SIZE * 4
CANVAS_SIZE = CANVAS_SHAPE * RESIZE_SIZE
SAMPLES = 250
TRAIN_OR_TEST = 'test'


def main():
    df_train = pd.read_csv(f'datasets/mnist/mnist_{TRAIN_OR_TEST}.csv')
    for i in range(SAMPLES):
        with open(f'datasets/mnist/labels/{TRAIN_OR_TEST}/{i}.txt', 'w') as f:
            canvas = np.zeros((CANVAS_SIZE, CANVAS_SIZE))
            for r in range(CANVAS_SHAPE):
                for c in range(CANVAS_SHAPE):
                    if r % 2 == 0 or c % 2 == 0:
                        continue
                    sample = df_train.sample(1)
                    values = sample.values[0]
                    cls = values[0]
                    data = values[1:]
                    data_2d = np.reshape(data, (ORIGINAL_SIZE, ORIGINAL_SIZE)).astype('uint8')
                    resized = cv2.resize(data_2d, (RESIZE_SIZE, RESIZE_SIZE))
                    canvas[r * RESIZE_SIZE:(r + 1) * RESIZE_SIZE, c * RESIZE_SIZE:(c + 1) * RESIZE_SIZE] = resized
                    x_center = (c * RESIZE_SIZE + ((RESIZE_SIZE - 1) / 2)) / CANVAS_SIZE
                    y_center = (r * RESIZE_SIZE + ((RESIZE_SIZE - 1) / 2)) / CANVAS_SIZE
                    width = RESIZE_SIZE / CANVAS_SIZE
                    height = RESIZE_SIZE / CANVAS_SIZE
                    f.write(f'{cls} {x_center} {y_center} {width} {height}\n')
            cv2.imwrite(f'datasets/mnist/images/{TRAIN_OR_TEST}/{i}.jpg', canvas)


if __name__ == '__main__':
    main()
