import React from 'react'
import {
    AdjustmentsVerticalIcon,
    ArrowPathIcon,
  } from '@heroicons/react/24/outline'
  
import {NavLink} from "react-router-dom";

import { soft_reset } from '../api';

import { Sidebardata } from './sidebar-data'

function Sidebar(){


  return (
    <div className='min-h-full flex justify-center basis-[25%] flex-col bg-primary'>
        <NavLink className="mx-auto cursor-pointer" to="/">
            <div className='laptop:text-4xl text-2xl font-semibold font-logofont mt-10 text-white'>Motion Tracker</div>
        </NavLink> 
        <div className='flex w-full items-center justify-center flex-auto text-white gap-5'>
            <ul className='w-full flex flex-col space-y-10 text-center items-end justify-center'>

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

        <div className='flex items-center cursor-pointer justify-center bg-secondary w-3/5 rounded-md text-white mx-auto mb-10'>
            <ArrowPathIcon className='w-[25px] h-[35px]'/>
            <div onclick={soft_reset} className="text-sm p-2 flex font-regular laptop:text-xl font-primaryfont">Soft Reset</div>
        </div>
        
    </div>

  )
}

export default Sidebar