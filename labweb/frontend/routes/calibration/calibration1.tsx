// import { VideoFeed } from '../components/Video'
import React from 'react';
import Sidebar from '../../components/sidebar'; 
import { NavLink } from 'react-router-dom';

export default function Calibration1() {
    return (
        <div className="flex flex-col w-full space-y-10 h-full justify-center items-center">

          <div className='w-2/3 h-[500px] bg-black'> 

          </div>

          <NavLink to="/calibration2" >
            <div className='flex cursor-pointer items-center justify-center bg-primary hover:bg-secondary w-[300px] rounded-md text-white mx-auto'>
                <div className="text-xl p-2 font-regular font-primaryfont">Start Calibration</div>
            </div>
          </NavLink>
          



        </div>
    )
}