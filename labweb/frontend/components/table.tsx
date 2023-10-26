import React from 'react';
import {DataRow, TableProps} from '../types';

// Table component for displaying data in output page
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
    <table className="rounded-lg table-auto">
      <thead className='text-white bg-primary font-primaryfont'>
        <tr>
          <th className="px-4 py-2">Local Position X</th>
          <th className="px-4 py-2">Local Position Y</th>
          <th className="px-4 py-2">Velocity</th>
        </tr>
      </thead>
      <tbody>
        {rowsWithVelocity.map((row) => (
          <tr key={`${row.x}-${row.y}`}>
            <td className="px-4 py-2 border">{row.x.toFixed(2)}</td>
            <td className="px-4 py-2 border">{row.y.toFixed(2)}</td>
            <td className="px-4 py-2 border">{row.velocity.toFixed(2)}</td>
          </tr>
        ))}

      </tbody>
    </table>
  );
};

export default Table;