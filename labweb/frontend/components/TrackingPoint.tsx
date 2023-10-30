
import React, { useState, useEffect } from 'react';
import { useCoordinateStore, useImageClick } from '../store';

// needs changes
export const TrackingPoint = ({TrackerPoint, setTrackerPoint}) => {

    const clicked = useImageClick((state) => state.clicked);
    

    // let buttonStyle = "border-red-600 bg-red-100";

    const handleButtonClick = () => {
      useImageClick.getState().setClicked(true);
    };

    const { X, Y } = useCoordinateStore(state => ({
      X: state.X,
      Y: state.Y,
    }));

  // useEffect to run the function when the clicked state changes
  useEffect(() => {
    if (clicked) {

      TrackerPoint.x = X;
      TrackerPoint.y = Y;
      
      // buttonStyle = "border-green-600 bg-green-100 text-green-600 drop-shadow-lg";


        setTrackerPoint(TrackerPoint);

        // Clear the selected button
        // setSelectedButton(null);
      }
      
    
  }, [clicked]);

    const getButtonClass = (): string => {
      if(clicked || (TrackerPoint.x !== 0 && TrackerPoint.y !== 0) ){
        return 'border-green-600 bg-green-100 text-green-600 drop-shadow-lg';
      }else{
        return 'border-red-600 bg-red-100';
      }
    }    
      
  return (
        <div className="w-2/3 p-4 flex space-y-2 flex-col drop-shadow-md justify-center items-center bg-[#DFE7EE] rounded-md">
          <h1 className='text-xl font-medium font-primaryfont'> Select the Target</h1>
          <p className='text-sm font-primaryfont font-regular'> Click the buttons below and select the corresponding marker on the camera view one at a time</p>


          <div className='grid gap-x-6 gap-y-3'>
                  <div onClick={() => handleButtonClick()} className={`flex group box-border cursor-pointer w-52 rounded-md text-center justify-center items-center border-2  hover:border-green-600 hover:bg-green-100 ${getButtonClass()}`}> 
                    <div className=' group-hover:text-green-600 p-1 basis-[66%]'>{TrackerPoint.title}</div>
                    <div className='text-gray-800 basis-[19%] p-1  bg-white border-l-2 border-gray-600 group-hover:border-green-600'>{TrackerPoint.x}</div>
                    <div className='text-gray-800 basis-[19%] p-1 rounded-r-lg bg-white border-l-2 border-gray-600 group-hover:border-green-600'>{TrackerPoint.y}</div>
                  </div> 
          </div>
        </div>
    
  )
}
