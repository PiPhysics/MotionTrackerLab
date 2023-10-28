import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { receive_object_points } from '../../api';

import { TargetCoordinatesPixels } from '../../types';
import CalibrationMarkers from '../../components/CalibrationMarkers';
import {Video} from '../../components/Video'; 
import {
    ArrowLeftCircleIcon,
    CheckCircleIcon
  } from '@heroicons/react/24/solid'
  
  import {
    MinusCircleIcon,
  } from '@heroicons/react/24/outline'
import TrackingPoint from '../../components/TrackingPoint';

// third step of calibration: here, user clicks on the object to be tracked and send the coordinates to backend 
export default function Calibration3() {

  const [TrackerPoint, setTrackerPoint] = useState<TargetCoordinatesPixels>({
    coordinates: { x: 0, y: 0, title: "Track Object" }
  });

  // below code is for sending the coordinates to backend after cleaning up the data as it is not in the correct format (refer to types.ts for the correct format, removed the title field)
  const sendPoints = async () => {
    const updatedTrackerPoint = Object.fromEntries(
      Object.entries(TrackerPoint).map(([key, value]) => [key, { x: value.x, y: value.y }])
    );

    // const updatedTrackerPoint =

    await receive_object_points(updatedTrackerPoint);
    console.log(updatedTrackerPoint);
  };



    return (
        <div className="flex flex-col items-center justify-center w-full space-y-4">

        {/* progress bar that tells stages of calibration process */}
        <div className='flex justify-between w-2/3 text-primary'>
          <NavLink to="/calibration2"> <ArrowLeftCircleIcon className='w-[50px] h-[50px]'/> </NavLink>
          <div className='flex items-center justify-center space-x-2 '>
            <CheckCircleIcon className=' w-[28px] h-[28px]' />
            <MinusCircleIcon className='w-[28px] h-[28px]'/>
            <MinusCircleIcon className='w-[28px] h-[28px]'/>
          </div>
        </div>

        {/* below is the video feed */}
        <div className='w-2/3 h-[450px]'> 
        <Video></Video>
        </div>


        <TrackingPoint TrackerPoint={TrackerPoint} setTrackerPoint={setTrackerPoint}/>
 
        {/* button to go to next stage of calibration: saving the experiment name */}
        <NavLink to="/experiment1" >
            <div className='flex cursor-pointer items-center justify-center bg-primary hover:bg-secondary w-[300px] rounded-md text-white mx-auto'>
                <button onClick={sendPoints} className="p-2 text-xl font-regular font-primaryfont">Track Object</button>
            </div>
        </NavLink>

      </div>
    )
}