import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import Table from '../../components/table';
import {DataRow, TableProps} from '../../types';

// below code is for parsing the csv file and displaying it in a table: still working on it!
export default function Output() {

    const [data, setData] = useState<DataRow[]>([]);

        // Parse CSV data on component mount
        useEffect(() => {
            Papa.parse('data/test/trial_000.csv', {
            header: true,
            complete: (results) => {
                setData(
                results.data.map((row) => ({
                    x: Number(row['local_position.x']),
                    y: Number(row['local_position.y']),
                    timestamp: Number(row['timestamp']),
                }))
                );
            },
            });
        }, []);


    return (
        <div>
            <h1 className="text-4xl">Data Collection</h1>
            <Table data={data} />
        </div>
        
    );
}




