import cv2
import matplotlib.pyplot as plt
import numpy as np
from motiontracker.calibration import get_hsl_lo_hi

def main():
    im = cv2.imread("assets/dummy_image_colored.jpg")
    hsv = cv2.cvtColor(im, cv2.COLOR_BGR2HSV)
    plt.imshow(hsv)
    plt.show()

    # mask1 = im[:, :, 1] > 100
    # mask2 = im[:, :, 2] > 100
    # mask = (mask1 & mask2)

    # mean = im[mask, :].mean(axis=0)
    # std = im[mask, :].std(axis=0)

    px=322
    py=121
    hsv_lo, hsv_hi = get_hsl_lo_hi(hsv, px, py)
    mask = cv2.inRange(hsv, hsv_lo, hsv_hi)
    # print(mean, std)
    # hsl_low = np.clip(mean - 3 * std, a_min=[0, 0, 0], a_max=[180, 255, 255]).astype(int)
    # hsl_hi = np.clip(mean + 3 * std, a_min=[0, 0, 0], a_max=[180, 255, 255]).astype(int)

    print(hsv_lo)
    print(hsv_hi)
    
    plt.imshow(mask)
    plt.show()

if __name__ == "__main__":
    main()