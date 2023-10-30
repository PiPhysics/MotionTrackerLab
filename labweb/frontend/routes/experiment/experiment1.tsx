import React from 'react';
import { NavLink } from 'react-router-dom';
import {Video} from '../../components/Video'; 

import {
    ArrowLeftCircleIcon,
    CheckCircleIcon
  } from '@heroicons/react/24/solid'
  
import {
  MinusCircleIcon,
} from '@heroicons/react/24/outline'

import {open_experiment, tracking_reset} from "../../api"


// first step of experiment: here, user names the experiment
export default function Experiment1() {

  // below code is for sending the experiment name to backend
  const sendName = async () => {
    const inputElement = document.getElementById("experiment");
    const experimentName = inputElement.value;
    await open_experiment(experimentName);
  }

    return (
        <div className="flex flex-col items-center justify-center w-full space-y-4">

        {/* progress bar that tells stages of experiment process */}
        <div className='flex justify-between w-2/3 text-primary'>
          <NavLink to="/calibration3"> <ArrowLeftCircleIcon onClick={tracking_reset} className='w-[50px] h-[50px]'/> </NavLink>
          <div className='flex items-center justify-center space-x-2 '>
            <CheckCircleIcon className=' w-[28px] h-[28px]' />
            <CheckCircleIcon className='w-[28px] h-[28px]'/>
            <MinusCircleIcon className='w-[28px] h-[28px]'/>
          </div>

        </div>

        {/* below is the video feed */}
        <div className='w-2/3 h-[450px]'> 
        <Video></Video>
        </div>

        {/* below is the input field for naming the experiment */}
        <div className="w-2/3 flex space-y-4 flex-col drop-shadow-md justify-center items-center h-[200px] bg-[#DFE7EE] rounded-md">
          <h1 className='text-xl font-medium font-primaryfont laptop:text-2xl'> Name the experiment</h1>
          <p className='text-sm text-center font-primaryfont font-regular laptop:text-base'>For each time you want to track a motion of an object, you will be required to name the experiment</p>
          <input className="shadow text-center appearance-none border rounded w-2/3 laptop:w-[40%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" autoComplete='off' id="experiment" type="text" placeholder="Experiment Name" required></input>
        </div>

        {/* button to go to next stage of experiment: recording the experiment name */}
        <NavLink to="/experiment2" >
            <div onClick={sendName} className='flex cursor-pointer items-center justify-center bg-primary hover:bg-secondary w-[300px] rounded-md text-white mx-auto'>
                <button  className="p-2 text-xl font-regular font-primaryfont">Save</button>
            </div>
        </NavLink>

      </div>
    )
}