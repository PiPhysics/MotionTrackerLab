import React from 'react';
import { NavLink } from 'react-router-dom';
import { receive_object_points } from '../../api';
import Video from '../../components/Video'; 
import {
    ArrowLeftCircleIcon,
    CheckCircleIcon
  } from '@heroicons/react/24/solid'
  
  import {
    MinusCircleIcon,
  } from '@heroicons/react/24/outline'

export default function Experiment1() {
    return (
        <div className="flex flex-col space-y-4 w-full justify-center items-center">

        <div className='flex w-2/3 text-primary justify-between'>
          <NavLink to="/calibration3"> <ArrowLeftCircleIcon className='w-[50px] h-[50px]'/> </NavLink>
          <div className='flex space-x-4 justify-center items-center '>
            <CheckCircleIcon className=' w-[28px] h-[28px]' />
            <CheckCircleIcon className='w-[28px] h-[28px]'/>
            <MinusCircleIcon className='w-[28px] h-[28px]'/>
          </div>

        </div>

        <div className='w-2/3 h-[450px]'> 
        <Video></Video>

        </div>

        <div className="w-2/3 flex space-y-4 flex-col drop-shadow-md justify-center items-center h-[200px] bg-[#DFE7EE] rounded-md">
          <h1 className='font-primaryfont font-medium laptop:text-2xl text-xl'> Name the experiment</h1>
          <p className=' text-center font-primaryfont font-regular laptop:text-base text-sm'>For each time you want to track a motion of an object, you will be required to name the experiment</p>

            
          
                <input className='' type="text"></input>
          
        
          
          

        </div>

        <NavLink to="/experiment2" >
            <div className='flex cursor-pointer items-center justify-center bg-primary hover:bg-secondary w-[300px] rounded-md text-white mx-auto'>
                <button onClick={receive_object_points} className="text-xl p-2 font-regular font-primaryfont">Save</button>
            </div>
        </NavLink>

      </div>
    )
}