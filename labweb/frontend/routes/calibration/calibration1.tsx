// import { VideoFeed } from '../components/Video'
import React from 'react';  
import {Video} from '../../components/Video'; 
import { NavLink } from 'react-router-dom';
import {start_calibration} from "../../api"

// first step of calibration: display the video feed once the user clicks on the start calibration button and leads to next step of calibration (calibration2)
export default function Calibration1() {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full space-y-10">

          {/* display the video feed */}
          <div className='w-2/3 h-[500px]'> 
            <Video></Video>
          </div>

          {/* start calibration button */}
          <NavLink to="/calibration2" >
            <div className='flex cursor-pointer items-center justify-center bg-primary hover:bg-secondary w-[300px] rounded-md text-white mx-auto'>
                <button onClick={start_calibration} className="text-2xl px-6 py-3 font-regular w-[350px] font-primaryfont">Start Calibration</button>
            </div>
          </NavLink>
          
        </div>
    )
}