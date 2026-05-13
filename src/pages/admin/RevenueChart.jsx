import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useEffect, useState } from "react";
import { getFees } from "../../api/feesApi";

const RevenueChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    getFees().then(res => {
      const formatted = res.data.map(f => ({
        date: f.date,
        amount: f.amount,
      }));
      setData(formatted);
    });
  }, []);

  return (
    <LineChart width={600} height={300} data={data}>
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <CartesianGrid stroke="#ccc" />
      <Line type="monotone" dataKey="amount" />
    </LineChart>
  );
};

export default RevenueChart;