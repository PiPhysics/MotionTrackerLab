
export interface Point{
    x: number
    y: number
}

export interface NamedPoint extends Point {
    title: string
}

export interface CalibrationCoordinatesPixels {
    tl: NamedPoint
    tm: NamedPoint
    tr: NamedPoint
    bl: NamedPoint
    bm: NamedPoint
    br: NamedPoint
}

export interface TargetCoordinatesPixels {
    coordinates: NamedPoint
}