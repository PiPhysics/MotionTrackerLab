import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { receive_object_points, calibration_reset } from '../../api';
import { NamedPoint } from '../../types';

import {Video} from '../../components/Video'; 
import {
    ArrowLeftCircleIcon,
    CheckCircleIcon
  } from '@heroicons/react/24/solid'
  
  import {
    MinusCircleIcon,
  } from '@heroicons/react/24/outline'
import {TrackingPoint} from '../../components/TrackingPoint';

// third step of calibration: here, user clicks on the object to be tracked and send the coordinates to backend 
export default function Calibration3() {

  const [TrackerPoint, setTrackerPoint] = useState<NamedPoint>({
     x: 0, y: 0, title: "Track Object" 
    }
  );

  // below code is for sending the coordinates to backend after cleaning up the data as it is not in the correct format (refer to types.ts for the correct format, removed the title field)
  const sendPoints = async () => {
    
    const { title, ...updatedTrackerPoint } = TrackerPoint;

    // const updatedTrackerPoint = {
    //   "x": 331,
    //   "y": 273
    // }

    await receive_object_points(updatedTrackerPoint);
    console.log(updatedTrackerPoint);
  };
  



    return (
        <div className="flex flex-col items-center justify-center w-full space-y-4">

        {/* progress bar that tells stages of calibration process */}
        <div className='flex justify-between w-2/3 text-primary'>
          <NavLink to="/calibration2"> <ArrowLeftCircleIcon onClick={calibration_reset} className='w-[50px] h-[50px]'/> </NavLink>
          <div className='flex items-center justify-center space-x-2 '>
            <CheckCircleIcon className=' w-[28px] h-[28px]'/>
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
            <div onClick={sendPoints} className='flex cursor-pointer items-center justify-center bg-primary hover:bg-secondary w-[300px] rounded-md text-white mx-auto'>
                <button  className="p-2 text-xl font-regular font-primaryfont">Track Object</button>
            </div>
        </NavLink>

      </div>
    )
}