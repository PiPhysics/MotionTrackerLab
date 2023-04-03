import React from 'react'
import {
    AdjustmentsVerticalIcon,
    ArrowPathIcon,
  } from '@heroicons/react/24/outline'
import {NavLink} from "react-router-dom";

import { Sidebardata } from './sidebar-data'

function Sidebar(){
  return (
    <div className='min-h-full flex justify-center basis-1/5 flex-col bg-primary'>
        <NavLink className="mx-auto cursor-pointer" to="/"><div className='text-4xl font-semibold font-logofont mt-10 text-white'>Motion Tracker</div></NavLink> 
        <div className='flex w-full items-center justify-center flex-auto text-white gap-5'>
            <ul className='w-full flex flex-col space-y-10 text-center items-end justify-center'>
                {Sidebardata.map((val) => {
                    return (
                        <NavLink to={val.link} className='p-2 font-regular font-primaryfont hover:bg-secondary hover:border-l-8 hover:border-white active:bg-secondary active:border-l-8 active:border-white w-4/5'>
                        <li className='flex'>
                     {val.icon} 
                    <span className='flex-[70%] text-xl flex items-center justify-start '>{val.title} </span>
                </li>
                </NavLink>
                    )
                })}
            </ul>
        </div>
        <div className='flex items-center cursor-pointer justify-center bg-secondary w-3/5 rounded-md text-white mx-auto mb-10'>
            <ArrowPathIcon className='w-[25px] h-[35px]'/>
            <div className="text-xl p-2 flex font-regular font-primaryfont">Soft Reset</div>
        </div>
    </div>

  )
}

export default Sidebar