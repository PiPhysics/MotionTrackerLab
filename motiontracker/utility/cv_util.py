import numpy as np
import cv2


def vconcat_resize(img_list, interpolation 
                   = cv2.INTER_CUBIC):
    # take minimum width
    w_min = min(img.shape[1] 
                for img in img_list)
      
    # resizing images
    im_list_resize = [cv2.resize(img,
                      (w_min, int(img.shape[0] * w_min / img.shape[1])),
                                 interpolation = interpolation)
                      for img in img_list]
    # return final image
    return cv2.vconcat(im_list_resize)


def hconcat_resize(img_list, 
                   interpolation 
                   = cv2.INTER_CUBIC):
    # take minimum heights
    h_min = min(img.shape[0] 
                for img in img_list)
      
    # image resizing 
    im_list_resize = [cv2.resize(img,
                       (int(img.shape[1] * h_min / img.shape[0]),
                        h_min), interpolation
                                 = interpolation) 
                      for img in img_list]
      
    # return final image
    return cv2.hconcat(im_list_resize)

def findContours(imgPre, roi = [0,0,640,360], min_area=1000, sort=True, filter=0, img=None, c=(255, 0, 0)):
    """
    Finds Contours in an image

    :param imgPre: Binary image on which we want to find contours. This image may be the result of a roi crop.
    :param roi: region of interest cropped from the original frame
    :param minArea: Minimum Area to detect as valid contour
    :param sort: True will sort the contours by area (biggest first)
    :param filter: Filters based on the corner points e.g. 4 = Rectangle or square, 0 = all accepted
    :param img: Image on which we want to draw contours
    :return: dictionary [contours, Area, BoundingBox, Center]
    """

    x_roi = roi[0]
    y_roi = roi[1]

    conFound = []
    drawCon = img is not None
    if drawCon:
        img_contours = img.copy()
    else:
        img_contours = None
    #roi = imgPre[y_roi:y_roi+h_roi, x_roi:x_roi+w_roi]
    contours, hierarchy = cv2.findContours(imgPre, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    for cnt in contours:
        area = cv2.contourArea(cnt)
        if area > min_area:
            peri = cv2.arcLength(cnt, True)
            approx = cv2.approxPolyDP(cnt, 0.02 * peri, True)
            # print(len(approx))
            if len(approx) == filter or filter == 0:
                x, y, w, h = cv2.boundingRect(approx)
                if w > 100:
                    continue
                cx, cy = x + (w // 2), y + (h // 2)
                conFound.append({"cnt": cnt, "area": area, "bbox": [x+x_roi, y+y_roi, w, h], "center": [cx+x_roi, cy+y_roi]})
                if drawCon:
                    # cv2.drawContours(img_contours, cnt, -1, c, 3)
                    cv2.rectangle(img_contours, (x+x_roi, y+y_roi), (x+x_roi + w, y+y_roi + h), c, 1)
                    cv2.rectangle(img_contours, (x_roi, y_roi), (x_roi + roi[2], y_roi + roi[3]), (0, 255, 0), 2)
                    cv2.circle(img_contours, (x+x_roi + (w // 2), y+y_roi + (h // 2)), 1, c, 1)
            

    if sort:
        conFound = sorted(conFound, key=lambda x: x["area"], reverse=True)
    result = dict(contours=conFound, img_contours=img_contours)
    return result