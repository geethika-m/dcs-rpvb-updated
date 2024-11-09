import { format, parseISO } from 'date-fns';
import React, { PureComponent, useEffect, useState } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];



const months = ["Jan","Feb","Mar","Apr","Jun","Jul","Aug", "Sep","oct", "Nov", "Dec"]
const BookingBarChart = ({records}) => {
    const [data, setData] = useState([])
    useEffect(() => {
        const result = {};
       records.forEach(item => {
            const month = item.date.split("-")[1]
            if(!result[month]) {
                result[month] = {
                   month,
                   count: 1
                }
            }
            result[month].count +=1
        })
        const arr = Object.values(result);
        setData(months.map(month => {
            const count = arr.find(item => item.month === month)?.count
            return {
                month,
                count: count || 0
            }
        }));
    }, [records]);

    return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip contentStyle={{background: '#fff'}} cursor={false}/>
            <Legend />
            <Bar dataKey="count" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
          </BarChart>
        </ResponsiveContainer>
      );
}


export default BookingBarChart;