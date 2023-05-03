import React from 'react';
import {useState} from 'react';
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

export default function Experiment2() {

  const [count, setCount] = useState(0);
  const [startClicked, setStartClicked] = useState(false);

  const handleStartClick = () => {
    setStartClicked(true);
  };

  const handleStopClick = () => {
    if (startClicked) {
      setCount(count + 1);
      setStartClicked(false);
    }
  };



    return (
        <div className="flex flex-col space-y-4 w-full justify-center items-center">

        <div className='flex w-2/3 text-primary justify-between'>
          <NavLink to="/experiment1"> <ArrowLeftCircleIcon className='w-[50px] h-[50px]'/> </NavLink>
          <div className='flex space-x-4 justify-center items-center '>
            <CheckCircleIcon className=' w-[28px] h-[28px]' />
            <MinusCircleIcon className='w-[28px] h-[28px]'/>
            <MinusCircleIcon className='w-[28px] h-[28px]'/>
          </div>

        </div>

        <div className='w-2/3 h-[450px] flex justify-center items-center'> 
        <Video></Video>

        </div>

        <div className="w-2/3  flex p-4 space-y-4 flex-col drop-shadow-md justify-center items-center bg-[#DFE7EE] rounded-md">
          <h1 className='font-primaryfont font-medium laptop:text-2xl text-xl'> Record your target's motion! {count} </h1>
          <p className='font-primaryfont font-regular laptop:text-base text-sm'>You are all set to record the motion. Your data will be under ‘Output’ tab</p>

            
            <div className='flex flex-col laptop:flex-row justify-center text-white gap-4 laptop:gap-12 items-center'>
              <button onClick={handleStartClick} className='rounded-full w-[120px]  laptop:w-[200px] py-2 px-6 text-xl laptop:text-2xl bg-green-600 z-20 hover:drop-shadow-xl'> Start</button>
              <button onClick={handleStopClick} className='rounded-full w-[120px] laptop:w-[200px] py-2 px-6 text-xl laptop:text-2xl bg-red-600 z-20 hover:drop-shadow-xl'> Stop</button>
            </div>
        
          
          

        </div>


      </div>
    )
}