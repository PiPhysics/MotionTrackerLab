import React from 'react'
import {
    AdjustmentsVerticalIcon,
    ChartPieIcon,
    Cog6ToothIcon,
    ClipboardDocumentListIcon,
  } from '@heroicons/react/24/outline'

export const Sidebardata = [
    {
        title: "Calibration",
        icon: <AdjustmentsVerticalIcon className='flex-[30%] grid place-items-center w-[25px] h-[35px]' />,
        link: "/calibration1",
    },
    {
        title: "Experiment",
        icon: <ClipboardDocumentListIcon className='flex-[30%] grid place-items-center w-[25px] h-[35px]'/>,
        link: "/experiment2",
    },
    {
        title: "Output",
        icon: <ChartPieIcon className='flex-[30%] grid place-items-center w-[25px] h-[35px]' />,
        link: "/output",
    },
    {
        title: "Debugger",
        icon: <Cog6ToothIcon className='flex-[30%] grid place-items-center w-[25px] h-[35px]' />,
        link: "/debug",
    },
] 
  

