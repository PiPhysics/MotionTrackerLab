
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

// export interface TargetCoordinatesPixels {
//     x: number;
//     y: number;
//     title: string;
// }

 export interface DataRow {
    x: number;
    y: number;
    timestamp: number;
  }
  
  export interface TableProps {
    data: DataRow[];
  }
