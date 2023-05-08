import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    ArrowLeftCircleIcon,
    CheckCircleIcon
  } from '@heroicons/react/24/solid'
  
  import {
    MinusCircleIcon,
  } from '@heroicons/react/24/outline'



const ProgressBar = (props: string) => {
  return (
    <div className='flex w-2/3 text-primary justify-between'>
      <NavLink to={props}>
        <ArrowLeftCircleIcon className='w-[50px] h-[50px]' />
      </NavLink>
      <div className='flex space-x-2 justify-center items-center'>
        <MinusCircleIcon className=' w-[28px] h-[28px]' />
        <MinusCircleIcon className='w-[28px] h-[28px]' />
        <MinusCircleIcon className='w-[28px] h-[28px]' />
      </div>
    </div>
  );
};

export default ProgressBar;
  