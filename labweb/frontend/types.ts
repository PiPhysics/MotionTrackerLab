
export interface Point{
    x: number;
    y: number;
}

export interface Points {
    tl: Point;
    tm: Point;
    tr: Point;
    bl: Point;
    bm: Point;
    br: Point;
}

export interface NamedPoint extends Point {
    title: string;
}

export interface CalibrationCoordinatesPixels {
    tl: NamedPoint;
    tm: NamedPoint;
    tr: NamedPoint;
    bl: NamedPoint;
    bm: NamedPoint;
    br: NamedPoint;
}

export type Object = {
    pixel_position_x: number;
    pixel_position_y: number;
    local_position_x: number;
    local_position_y: number;
    timestamp: number;
  };



 
