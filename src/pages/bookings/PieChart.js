import React, { PureComponent, useEffect, useState } from 'react';
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { database } from '../../firebase';
import { format } from 'date-fns';
import { museumsList } from '../../utils/constant';

const data01 = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
  { name: 'Group E', value: 278 },
  { name: 'Group F', value: 189 },
];



const MuseumPieChart = ({records}) => {
    const [data, setData] = useState([])
    useEffect(() => {
        const result = {};
        records.forEach(item => {
            const name = museumsList.find(museum => museum.value === item.museum)?.label;
  
            if(name !== undefined) {
                if(!result[name]) {
                    result[name] = 1;
                } else {
                    result[name] += 1;
                }
            }
        })
        
        setData(Object.keys(result).map(key => {
            return {
                name: key, value: result[key]
            }
        }));
    }, [records]);
   
    return (
         <ResponsiveContainer width="100%" height="100%">
          <PieChart width={400} height={400}>
            <Pie
              dataKey="value"
              isAnimationActive={false}
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      );
}

export default MuseumPieChart;