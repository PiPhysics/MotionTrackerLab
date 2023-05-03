import React from 'react';
import { NavLink } from 'react-router-dom';
import Video from '../../components/Video';
import CalibrationMarkers from '../../components/CalibrationMarkers';
import { CalibrationCoordinatesPixels } from '../../types';

import {
  ArrowLeftCircleIcon,
} from '@heroicons/react/24/solid'

import {
  MinusCircleIcon,
} from '@heroicons/react/24/outline'
import {receive_calibration_points} from '../../api';

// const Markers: CalibrationCoordinatesPixels = [
//   {
//     title: "Top Left",
//     x: "X",
//     y: "Y",
//   },
//   {
//     title: "Bottom Left",
//     x: "X",
//     y: "Y",
//   },
//   {
//     title: "Top Mid",
//     x: "X",
//     y: "Y",
//   },
//   {
//     title: "Bottom Mid",
//     x: "X",
//     y: "Y",
//   },
//   {
//     title: "Top Right",
//     x: "X",
//     y: "Y",
//   },{
//     title: "Bottom Right",
//     x: "X",
//     y: "Y",
//   }
// ]

// const Markers: CalibrationCoordinatesPixels = {
//   tl: {x:0, y:0, title: "Top Left"},
//   tm: {x:0, y:0, title: "Top Middle"},
//   tr: {x:0, y:0, title: "Top Right"},
//   bl: {x:0, y:0, title: "Bottom Left"},
//   bm: {x:0, y:0, title: "Bottom Middle"},
//   br: {x:0, y:0, title: "Bottom Right"}
// }


export default function Calibration2() {
    return (
      <div className="flex py-4 flex-col space-y-4 w-full justify-center items-center">

        <div className='flex w-2/3 text-primary justify-between'>
          <NavLink to="/calibration1"> <ArrowLeftCircleIcon className='w-[50px] h-[50px]'/> </NavLink>
          <div className='flex space-x-4 justify-center items-center'>
            <MinusCircleIcon className='w-[28px] h-[28px]'/>
            <MinusCircleIcon className='w-[28px] h-[28px]'/>
            <MinusCircleIcon className='w-[28px] h-[28px]'/>
          </div>

        </div>

        <div className='w-2/3 h-[450px]'> 
          <Video></Video>

        </div>

        <CalibrationMarkers />
{/* 
        <div className="w-2/3 flex space-y-2 flex-col drop-shadow-md justify-center items-center h-[200px] bg-[#DFE7EE] rounded-md">
          <h1 className='font-primaryfont font-medium text-xl'> Select the Markers</h1>
          <p className='font-primaryfont font-regular text-sm'> Click the buttons below and select the corresponding marker on the camera view one at a time</p>

          <div className='grid grid-cols-3 gap-x-6 gap-y-3'>
            {Object.entries(Markers).map(([key, value]) => {
                    return (
                  <div key={key} className='flex group cursor-pointer p-2 h-8 w-48 rounded-md text-center justify-center items-center border-2 border-red-600 bg-red-100  hover:border-green-600 hover:bg-green-100 '>
                    <div className='text-red-600 group-hover:text-green-600 basis-3/5'>{value.title}</div>
                    <div className='text-gray-800 basis-1/5 border-l-2 border-red-600 group-hover:border-green-600'>{value.x}</div>
                    <div className='text-gray-800 basis-1/5 border-l-2 border-red-600 group-hover:border-green-600'>{value.y}</div>
                  </div> 
                    )})}
          </div>

          
          
        </div> */}

        <NavLink to="/calibration3" >
            <div className='flex cursor-pointer items-center justify-center bg-primary hover:bg-secondary w-[300px] rounded-md text-white mx-auto'>
                <button onClick={receive_calibration_points} className="text-xl p-2 font-regular font-primaryfont">Calibrate Markers</button>
            </div>
        </NavLink>

      </div>

    )
}