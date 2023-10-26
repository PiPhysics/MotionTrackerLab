import {create} from 'zustand';

// type definition for coordinate store
type CoordinateStore = {
    X: number;
    Y: number;
    setCoordinates: (x: number, y: number) => void;
  };
  
// store for coordinates
export const useCoordinateStore = create<CoordinateStore>((set) => ({
    X: 0,
    Y: 0,
    setCoordinates: (x, y) => set({ X: x, Y: y }),
}));

// type definition for image click store
type ImageClick = {
    clicked: boolean;
    setClicked: (value: boolean) => void;
  };
  
// store for image click
export const useImageClick = create<ImageClick>((set) => ({
clicked: false,
setClicked: (value) => set({ clicked: value }),
}));