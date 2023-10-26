// import eventBus from "../eventBus"
import React, { useState, useRef } from 'react';

// needs changes
const TrackingPoint = ({TrackerPoint, setTrackerPoint}) => {

    const [selectedButton, setSelectedButton] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleButtonClick = (buttonKey: string) => {
      setSelectedButton(buttonKey);
    };

    const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (selectedButton !== null && canvasRef.current !== null) {
        const canvasRect = canvasRef.current.getBoundingClientRect()
        const x = (event.clientX - canvasRect.left).toFixed(0);
        const y = (event.clientY - canvasRect.top).toFixed(0);
       

        const secondChild = document.querySelector(`#${selectedButton} :nth-child(2)`);
        const thirdChild = document.querySelector(`#${selectedButton} :nth-child(3)`);

        secondChild.innerHTML = (`${x}`);
        thirdChild.innerHTML = (`${y}`);

        const newMarkers = { ...TrackerPoint };
        newMarkers[selectedButton].x = Number(x);
        newMarkers[selectedButton].y = Number(y);
        setTrackerPoint(newMarkers);

        setSelectedButton(null);

      }
    };

    const getButtonClass = (buttonId: string): string => {
      if (selectedButton === buttonId || TrackerPoint[buttonId].x !== 0) {
        return 'border-green-600 bg-green-100 text-green-600 drop-shadow-lg';
      } else {
        return 'border-red-600 bg-red-100';
      }
    };

    
      
  return (
        <div className="w-2/3 p-4 flex space-y-2 flex-col drop-shadow-md justify-center items-center bg-[#DFE7EE] rounded-md">
          <canvas className="bg-white w-[200px]" ref={canvasRef} onClick={handleCanvasClick} />
          <h1 className='text-xl font-medium font-primaryfont'> Select the Target</h1>
          <p className='text-sm font-primaryfont font-regular'> Click the buttons below and select the corresponding marker on the camera view one at a time</p>


          <div className='grid gap-x-6 gap-y-3'>
            {Object.entries(TrackerPoint).map(([key, value]) => {
                    return (
                  <div key={key} id={key} onClick={() => handleButtonClick(key)} className={`flex group box-border cursor-pointer w-52 rounded-md text-center justify-center items-center border-2  hover:border-green-600 hover:bg-green-100 ${getButtonClass(key)}`}> 
                    <div className=' group-hover:text-green-600 p-1 basis-[66%]'>{value.title}</div>
                    <div className='text-gray-800 basis-[19%] p-1  bg-white border-l-2 border-gray-600 group-hover:border-green-600'>{value.x}</div>
                    <div className='text-gray-800 basis-[19%] p-1 rounded-r-lg bg-white border-l-2 border-gray-600 group-hover:border-green-600'>{value.y}</div>
                  </div> 
                    )})}
          </div>
        </div>
    
  )
}

export default TrackingPoint