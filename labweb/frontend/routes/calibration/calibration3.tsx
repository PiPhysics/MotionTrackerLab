import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    ArrowLeftCircleIcon,
    CheckCircleIcon
  } from '@heroicons/react/24/solid'
  
  import {
    MinusCircleIcon,
  } from '@heroicons/react/24/outline'

export default function Calibration3() {
    return (
        <div className="flex flex-col space-y-4 w-full justify-center items-center">

        <div className='flex w-2/3 text-primary justify-between'>
          <NavLink to="/calibration2"> <ArrowLeftCircleIcon className='w-[50px] h-[50px]'/> </NavLink>
          <div className='flex space-x-4 justify-center items-center '>
            <CheckCircleIcon className=' w-[28px] h-[28px]' />
            <MinusCircleIcon className='w-[28px] h-[28px]'/>
            <MinusCircleIcon className='w-[28px] h-[28px]'/>
          </div>

        </div>

        <div className='w-2/3 h-[400px] bg-black'> 

        </div>

        <div className="w-2/3 flex space-y-2 flex-col drop-shadow-md justify-center items-center h-[200px] bg-[#DFE7EE] rounded-md">
          <h1 className='font-primaryfont font-medium text-xl'> Select the Target</h1>
          <p className='font-primaryfont font-regular text-sm'>Click the buttons below and select the corresponding marker on the camera view one at a time</p>

            
            <div className='flex group cursor-pointer p-2 h-8 w-48 rounded-md text-center justify-center items-center border-2 border-red-600 bg-red-200  hover:border-green-600 hover:bg-green-200 '>
                <div className='text-red-600 group-hover:text-green-600 basis-3/5'>Track Object</div>
                <div className='text-gray-800 basis-1/5 border-l-2 border-red-600 group-hover:border-green-600'>X</div>
                <div className='text-gray-800 basis-1/5 border-l-2 border-red-600 group-hover:border-green-600'>Y</div>
            </div>
        
          
          

        </div>

        <NavLink to="/experiment" >
          <div className='flex cursor-pointer items-center justify-center bg-primary hover:bg-secondary w-[300px] rounded-md text-white'>
              <div className="text-xl p-2 font-regular font-primaryfont">Track Object</div>
          </div>
        </NavLink>

      </div>
    )
}