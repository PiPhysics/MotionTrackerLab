// import { VideoFeed } from '../components/Video'
import React from 'react';  
import Video from '../../components/Video'; 
import { NavLink } from 'react-router-dom';
import {start_calibration} from "../../api"

export default function Calibration1() {
    return (
        <div className="flex flex-col w-full space-y-10 h-full justify-center items-center">

          <div className='w-2/3 h-[500px]'> 
            <Video></Video>

          </div>
          <NavLink to="/calibration2" >
            <div className='flex cursor-pointer items-center justify-center bg-primary hover:bg-secondary w-[300px] rounded-md text-white mx-auto'>
                <button onClick={start_calibration} className="text-2xl px-6 py-3 font-regular w-[350px] font-primaryfont">Start Calibration</button>
            </div>
          </NavLink>
          



        </div>
    )
}