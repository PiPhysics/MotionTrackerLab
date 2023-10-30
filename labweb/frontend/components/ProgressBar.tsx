import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    ArrowLeftCircleIcon,
    CheckCircleIcon
  } from '@heroicons/react/24/solid'
  
  import {
    MinusCircleIcon,
  } from '@heroicons/react/24/outline'

  import { soft_reset } from '../api';

// below code is for the progress bar
const ProgressBar = (props: any) => {
  return (
    <div className='flex justify-between w-2/3 text-primary'>
      <NavLink to={props}>
        <ArrowLeftCircleIcon onClick={soft_reset} className='w-[50px] h-[50px]' />
      </NavLink>
      <div className='flex items-center justify-center space-x-2'>
        <MinusCircleIcon className=' w-[28px] h-[28px]' />
        <MinusCircleIcon className='w-[28px] h-[28px]' />
        <MinusCircleIcon className='w-[28px] h-[28px]' />
      </div>
    </div>
  );
};

export default ProgressBar;
  