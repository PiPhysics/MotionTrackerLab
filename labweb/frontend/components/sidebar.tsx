import React from 'react'
import {
    AdjustmentsVerticalIcon,
    ArrowPathIcon,
  } from '@heroicons/react/24/outline'
  
import {NavLink} from "react-router-dom";

import { soft_reset } from '../api';

import { Sidebardata } from './sidebar-data'

// Component for the sidebar
function Sidebar(){

  return (
    <div className='min-h-full flex justify-center basis-[25%] flex-col bg-primary'>
        <NavLink className="mx-auto cursor-pointer" to="/">
            <div className='mt-10 text-2xl font-semibold text-white laptop:text-4xl font-logofont'>Motion Tracker</div>
        </NavLink> 
        <div className='flex items-center justify-center flex-auto w-full gap-5 text-white'>
            <ul className='flex flex-col items-end justify-center w-full space-y-10 text-center'>

                {Sidebardata.map((val) => {
                    return (
                        <NavLink to={val.link} key={val.title}
                        className={({isActive}) => {
                            return (
                                "laptop:p-2 p-1 font-regular font-primaryfont w-4/5 " +
                                (isActive || (val.link === "/experiment1" && window.location.pathname === "/experiment2") || (val.link === "/calibration1" && (window.location.pathname === "/calibration2" || window.location.pathname === "/calibration3") )? "bg-secondary border-l-4 laptop:border-l-8 border-white" : "")
                            )
                        }}>
                        <li className='flex'>
                     {val.icon} 
                    <span className='flex-[70%] text-base laptop:text-xl flex items-center justify-start '>{val.title} </span>
                </li>
                </NavLink>
                    )
                })}
            </ul>
        </div>

        <div className='flex items-center justify-center w-3/5 mx-auto mb-10 text-white rounded-md cursor-pointer bg-secondary'>
            <ArrowPathIcon className='w-[25px] h-[35px]'/>
            <div onclick={soft_reset} className="flex p-2 text-sm font-regular laptop:text-xl font-primaryfont">Soft Reset</div>
        </div>
        
    </div>

  )
}

export default Sidebar