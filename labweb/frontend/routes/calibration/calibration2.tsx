import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Video from '../../components/Video';
import CalibrationMarkers from '../../components/CalibrationMarkers';
import { CalibrationCoordinatesPixels } from '../../types';
import {
  ArrowLeftCircleIcon,
} from '@heroicons/react/24/solid'
import {
  MinusCircleIcon,
} from '@heroicons/react/24/outline'

import {receive_calibration_points} from '../../api';




export default function Calibration2() {

  const [Markers, setMarkers] = useState<CalibrationCoordinatesPixels>({
    tl: { x: 0, y: 0, title: "Top Left" },
    tm: { x: 0, y: 0, title: "Top Middle" },
    tr: { x: 0, y: 0, title: "Top Right" },
    bl: { x: 0, y: 0, title: "Bottom Left" },
    bm: { x: 0, y: 0, title: "Bottom Middle" },
    br: { x: 0, y: 0, title: "Bottom Right" },
  });

    return (
      <div className="flex py-4 flex-col space-y-4 w-full justify-center items-center">

        <div className='flex w-2/3 text-primary justify-between'>
          <NavLink to="/calibration1"> <ArrowLeftCircleIcon className='w-[50px] h-[50px]'/> </NavLink>
          <div className='flex space-x-4 justify-center items-center'>
            <MinusCircleIcon className='w-[28px] h-[28px]'/>
            <MinusCircleIcon className='w-[28px] h-[28px]'/>
            <MinusCircleIcon className='w-[28px] h-[28px]'/>
          </div>

        </div>

        <div className='w-2/3 h-[450px]'> 
          <Video></Video>

        </div>

        <CalibrationMarkers Markers={Markers} setMarkers={setMarkers}/>


        <NavLink to="/calibration3" >
            <div className='flex cursor-pointer items-center justify-center bg-primary hover:bg-secondary w-[300px] rounded-md text-white mx-auto'>
                <button onClick={receive_calibration_points} className="text-xl p-2 font-regular font-primaryfont">Calibrate Markers</button>
            </div>
        </NavLink>

      </div>

    )
}