import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {Video} from '../../components/Video';
import CalibrationMarkers from '../../components/CalibrationMarkers';
import { CalibrationCoordinatesPixels } from '../../types';
// import  ProgressBar from '../../components/ProgressBar';

import {
    ArrowLeftCircleIcon,
    CheckCircleIcon
  } from '@heroicons/react/24/solid'
  
  import {
    MinusCircleIcon,
  } from '@heroicons/react/24/outline'

  import { soft_reset } from '../../api';


import {receive_calibration_points} from '../../api';

// second step of calibration: here, user clicks on the markers on the screen and send the 6 coordinates to backend
export default function Calibration2() {

  const [Markers, setMarkers] = useState<CalibrationCoordinatesPixels>({
    tl: { x: 0, y: 0, title: "Top Left" },
    tm: { x: 0, y: 0, title: "Top Middle" },
    tr: { x: 0, y: 0, title: "Top Right" },
    bl: { x: 0, y: 0, title: "Bottom Left" },
    bm: { x: 0, y: 0, title: "Bottom Middle" },
    br: { x: 0, y: 0, title: "Bottom Right" },
  });

  // below code is for sending the coordinates to backend after cleaning up the data as it is not in the correct format (refer to types.ts for the correct format, removed the title field)
  const sendPoints = async () => {
    const updatedMarkers = Object.fromEntries(
      Object.entries(Markers).map(([key, value]) => [key, { x: value.x, y: value.y }])
    );
    await receive_calibration_points(updatedMarkers);
    console.log(updatedMarkers);
  };

    return (
      <div className="flex flex-col items-center justify-center w-full py-4 space-y-4">

        {/* progress bar that tells stages of calibration process*/}
        <div className='flex justify-between w-2/3 text-primary'>
      <NavLink to="/calibration1">
        <ArrowLeftCircleIcon onClick={soft_reset} className='w-[50px] h-[50px]' />
      </NavLink>
      <div className='flex items-center justify-center space-x-2'>
        <MinusCircleIcon className=' w-[28px] h-[28px]' />
        <MinusCircleIcon className='w-[28px] h-[28px]' />
        <MinusCircleIcon className='w-[28px] h-[28px]' />
      </div>
    </div>
        
        {/* below is the video feed */}
        <div className='w-2/3 h-[450px]'> 
          <Video></Video>
        </div>

        <CalibrationMarkers Markers={Markers} setMarkers={setMarkers}/>

        {/* button to go to next stage of calibration */}
        <NavLink to="/calibration3" >
            <div onClick={sendPoints} className='flex cursor-pointer items-center justify-center bg-primary hover:bg-secondary w-[300px] rounded-md text-white mx-auto'>
                <button className="p-2 text-xl cursor-pointer font-regular font-primaryfont">Calibrate Markers</button>
            </div>
        </NavLink>

      </div>

    )
}