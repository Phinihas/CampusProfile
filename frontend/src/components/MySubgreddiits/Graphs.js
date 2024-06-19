import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

function Graph(props) {
  return (
    <LineChart width={600} height={300} data={props.data}>
      <XAxis dataKey="dt" />
      <YAxis />
      <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
      <Line type="monotone" dataKey="value" stroke="#8884d8" />
      <Tooltip />
      <Legend />
    </LineChart>
  );
}

export default Graph;
