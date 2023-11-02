// ObjectTable.tsx
import React from 'react';

import { Object } from '../types';

import {
  FolderArrowDownIcon,
} from '@heroicons/react/24/solid'



const ObjectTable: React.FC = () => {
  const objects: Object[] = [
    {
      "pixel_position_x": 100,
      "pixel_position_y": 150,
      "local_position_x": 20.5,
      "local_position_y": 30.2,
      "timestamp": 165
    },
    {
      "pixel_position_x": 200,
      "pixel_position_y": 300,
      "local_position_x": 40.1,
      "local_position_y": 25.3,
      "timestamp": 175
    },
    {
      "pixel_position_x": 350,
      "pixel_position_y": 400,
      "local_position_x": 60.2,
      "local_position_y": 40.5,
      "timestamp": 185
    },
    {
      "pixel_position_x": 120,
      "pixel_position_y": 250,
      "local_position_x": 22.0,
      "local_position_y": 35.1,
      "timestamp": 195
    },
    {
      "pixel_position_x": 180,
      "pixel_position_y": 320,
      "local_position_x": 15.5,
      "local_position_y": 45.2,
      "timestamp": 205
    },
    {
      "pixel_position_x": 270,
      "pixel_position_y": 380,
      "local_position_x": 30.0,
      "local_position_y": 50.0,
      "timestamp": 215
    }
  ];

  return (
    <div className='relative flex flex-col items-center justify-center'>
    
    <div className='absolute p-2.5 rounded-lg cursor-pointer hover:bg-secondary right-2 -top-1 bg-primary max-w-min'><FolderArrowDownIcon className='text-white w-[18px] h-[18px]'/> </div>
    <div className="pb-2 text-3xl font-medium font-primaryfont">Trial 1</div>
    <div className="overflow-hidden border shadow-xl rounded-xl">
      <table className="min-w-full">
        <thead className='text-sm uppercase bg-primary'>
          <tr className='border-black '>
            <th className='px-2 py-4 font-light text-white'>
              Time (sec)
            </th>
            <th className='px-2 py-4 font-light text-white'>
              Distance (mm)
            </th>
            <th className='px-2 py-4 font-light text-white'>
              Velocity
            </th>
          </tr>
        </thead>
        <tbody className="bg-white ">
          {objects.length ? (
            objects.map((object, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="py-4 text-sm text-gray-500 px-11">
                  {object.timestamp}
                </td>

                {/* Eucleadean distance formula */}
                <td className="py-4 text-sm text-gray-500 px-11">
                  {Math.sqrt(
                    (object.local_position_x - object.pixel_position_x) ** 2 +
                      (object.local_position_y - object.pixel_position_y) ** 2
                  ).toFixed(2)}
                </td>
                <td className="py-4 text-sm text-gray-500 px-11">
                  {Math.sqrt(
                    ((object.local_position_x - object.pixel_position_x) ** 2 +
                      (object.local_position_y - object.pixel_position_y) ** 2
                  ) / object.timestamp).toFixed(2)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="px-6 py-4 text-sm text-gray-500" colSpan={3}>
                No objects to display
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default ObjectTable;
