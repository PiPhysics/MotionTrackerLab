import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { receive_object_points } from '../../api';

import { TargetCoordinatesPixels } from '../../types';
import CalibrationMarkers from '../../components/CalibrationMarkers';
import Video from '../../components/Video'; 
import {
    ArrowLeftCircleIcon,
    CheckCircleIcon
  } from '@heroicons/react/24/solid'
  
  import {
    MinusCircleIcon,
  } from '@heroicons/react/24/outline'
import TrackingPoint from '../../components/TrackingPoint';


export default function Calibration3() {

  const [TrackerPoint, setTrackerPoint] = useState<TargetCoordinatesPixels>({
    coordinates: { x: 0, y: 0, title: "Track Object" }
  });

  const sendPoints = async () => {
    const updatedTrackerPoint = Object.fromEntries(
      Object.entries(TrackerPoint).map(([key, value]) => [key, { x: value.x, y: value.y }])
    );
    await receive_object_points(updatedTrackerPoint);
    console.log(updatedTrackerPoint);
  };



    return (
        <div className="flex flex-col space-y-4 w-full justify-center items-center">

        <div className='flex w-2/3 text-primary justify-between'>
          <NavLink to="/calibration2"> <ArrowLeftCircleIcon className='w-[50px] h-[50px]'/> </NavLink>
          <div className='flex space-x-2 justify-center items-center '>
            <CheckCircleIcon className=' w-[28px] h-[28px]' />
            <MinusCircleIcon className='w-[28px] h-[28px]'/>
            <MinusCircleIcon className='w-[28px] h-[28px]'/>
          </div>
        </div>

        <div className='w-2/3 h-[450px]'> 
        <Video></Video>
        </div>

        <TrackingPoint TrackerPoint={TrackerPoint} setTrackerPoint={setTrackerPoint}/>
 

        <NavLink to="/experiment1" >
            <div className='flex cursor-pointer items-center justify-center bg-primary hover:bg-secondary w-[300px] rounded-md text-white mx-auto'>
                <button onClick={sendPoints} className="text-xl p-2 font-regular font-primaryfont">Track Object</button>
            </div>
        </NavLink>

      </div>
    )
}