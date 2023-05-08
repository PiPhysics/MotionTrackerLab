import React from 'react';
import {DataRow, TableProps} from '../types';


const Table: React.FC<TableProps> = ({ data }) => {
  // Calculate velocity for each row
  const rowsWithVelocity = data.map((row, i) => {
    const prevRow = data[i - 1];
    const velocity = prevRow
      ? Math.sqrt(
          Math.pow(row.x - prevRow.x, 2) + Math.pow(row.y - prevRow.y, 2)
        ) / (row.timestamp - prevRow.timestamp)
      : 0;
    return { ...row, velocity };
  });

  // Render table
  return (
    <table className="table-auto rounded-lg">
      <thead className='bg-primary text-white font-primaryfont'>
        <tr>
          <th className="px-4 py-2">Local Position X</th>
          <th className="px-4 py-2">Local Position Y</th>
          <th className="px-4 py-2">Velocity</th>
        </tr>
      </thead>
      <tbody>
        {rowsWithVelocity.map((row) => (
          <tr key={`${row.x}-${row.y}`}>
            <td className="border px-4 py-2">{row.x.toFixed(2)}</td>
            <td className="border px-4 py-2">{row.y.toFixed(2)}</td>
            <td className="border px-4 py-2">{row.velocity.toFixed(2)}</td>
          </tr>
        ))}

      </tbody>
    </table>
  );
};

export default Table;