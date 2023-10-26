import React from 'react';
import {useState} from 'react';
import { NavLink } from 'react-router-dom';
import { receive_object_points } from '../../api';
import {Video} from '../../components/Video'; 
import { start_recording, stop_recording } from '../../api';

import {
    ArrowLeftCircleIcon,
    CheckCircleIcon
  } from '@heroicons/react/24/solid'
  
  import {
    MinusCircleIcon,
  } from '@heroicons/react/24/outline'

// second step of experiment: here, user clicks on the start and stop button to record data
export default function Experiment2() {

  // below code is for setting the count of the number of times the user has recorded the data
  const [count, setCount] = useState(0);
  const [startClicked, setStartClicked] = useState(false);

  const handleStartClick = async () => {
    setStartClicked(true);
    await start_recording();
  };

  const handleStopClick = async () => {
    if (startClicked) {
      setCount(count + 1);
      setStartClicked(false);
      await stop_recording();
    }
  };

    return (
        <div className="flex flex-col items-center justify-center w-full space-y-4">
        
        {/* progress bar that tells stages of experiment process */}
        <div className='flex justify-between w-2/3 text-primary'>
          <NavLink to="/experiment1"> <ArrowLeftCircleIcon className='w-[50px] h-[50px]'/> </NavLink>
          <div className='flex items-center justify-center space-x-2 '>
            <CheckCircleIcon className=' w-[28px] h-[28px]' />
            <CheckCircleIcon className='w-[28px] h-[28px]'/>
            <CheckCircleIcon className='w-[28px] h-[28px]'/>
          </div>

        </div>

        {/* below is the video feed */}
        <div className='w-2/3 h-[450px] flex justify-center items-center'> 
        <Video></Video>
        </div>

        {/* below is the button to start and stop recording */}
        <div className="w-2/3  flex p-4 space-y-4 flex-col drop-shadow-md justify-center items-center bg-[#DFE7EE] rounded-md">
          <h1 className='text-xl font-medium font-primaryfont laptop:text-2xl'> Record your target's motion! {count} </h1>
          <p className='text-sm font-primaryfont font-regular laptop:text-base'>You are all set to record the motion. Your data will be under ‘Output’ tab</p>
  
          <div className='flex flex-col items-center justify-center gap-4 text-white laptop:flex-row laptop:gap-12'>
            <button onClick={handleStartClick} className='rounded-full w-[120px]  laptop:w-[200px] py-2 px-6 text-xl laptop:text-2xl bg-green-600 z-20 hover:drop-shadow-xl'> Start</button>
            <button onClick={handleStopClick} disabled={!startClicked} className='rounded-full w-[120px] laptop:w-[200px] py-2 px-6 text-xl laptop:text-2xl bg-red-600 z-20 hover:drop-shadow-xl'> Stop</button>
          </div>
        
        </div>

      </div>
    )
}