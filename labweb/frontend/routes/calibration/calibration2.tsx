import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Video from '../../components/Video';
import CalibrationMarkers from '../../components/CalibrationMarkers';
import { CalibrationCoordinatesPixels } from '../../types';
import  ProgressBar from '../../components/ProgressBar';


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

  const sendPoints = async () => {
    const updatedMarkers = Object.fromEntries(
      Object.entries(Markers).map(([key, value]) => [key, { x: value.x, y: value.y }])
    );
    await receive_calibration_points(updatedMarkers);
    console.log(updatedMarkers);
  };

    return (
      <div className="flex py-4 flex-col space-y-4 w-full justify-center items-center">

        <ProgressBar props="/calibration1" />
        

        <div className='w-2/3 h-[450px]'> 
          <Video></Video>
        </div>

        <CalibrationMarkers Markers={Markers} setMarkers={setMarkers}/>


        <NavLink to="/calibration3" >
            <div className='flex cursor-pointer items-center justify-center bg-primary hover:bg-secondary w-[300px] rounded-md text-white mx-auto'>
                <button onClick={sendPoints} className="text-xl p-2 font-regular font-primaryfont">Calibrate Markers</button>
            </div>
        </NavLink>

      </div>

    )
}