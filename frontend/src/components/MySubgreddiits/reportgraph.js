import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
  } from "recharts";
const ReportsDeletesChart = (props) => {
    return (
      <LineChart width={600} height={300} data={props.data}>
        <XAxis dataKey="dt" />
        <YAxis domain={[0, 'auto']} />
        <CartesianGrid />
        <Line type="monotone" dataKey="report" stroke="#8884d8" />
        <Line type="monotone" dataKey="del" stroke="#82ca9d" />
        <Tooltip />
      </LineChart>
    );
  };
  
  export default ReportsDeletesChart;