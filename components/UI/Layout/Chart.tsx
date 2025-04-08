import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import { AppLogoLoader } from "../Loader";

export default function Chart({
  data,
  name,
  type,
}: {
  data: { id: string; value: number }[] | null;
  name?: React.ReactNode;
  type: "Pie" | "Bar" | "Line";
}) {
  if (!data) {
    return (
      <div
        className="panel p-2  grow text-xs py-2 h-full"
        style={{ background: "white", color: "black" }}
      >
        <div className="font-bold text-lg">{name}</div>
        <div className="w-full flex flex-col items-center justify-center overflow-x-auto h-full min-h-[300px] text-primary">
          <AppLogoLoader />
        </div>
      </div>
    );
  }
  if (type === "Bar") {
    const colors = [
      "#8884d8",
      "#82ca9d",
      "#ffc658",
      "#ff7f50",
      "#87cefa",
      "#da70d6",
      "#32cd32",
      "#ff69b4",
      "#ba55d3",
      "#cd5c5c",
    ];

    return (
      <div
        className="panel p-2  grow text-xs py-2 h-full"
        style={{ background: "white", color: "black" }}
      >
        <div className="font-bold text-lg">{name}</div>
        <div className="w-full overflow-x-auto h-full min-h-[300px]">
          <div
            className="z-0 h-full"
            style={{ minWidth: `${data.length * 60}px` }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={data}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                barSize={10}
              >
                <XAxis dataKey="id" />
                <Tooltip />
                <Bar dataKey="value">
                  {data.map((_, index) => (
                    <Cell key={index} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }
  if (type === "Line")
    return (
      <div
        className="panel p-2  grow text-xs py-2  h-full"
        style={{ background: "white", color: "black" }}
      >
        <div className="font-bold text-lg">{name}</div>
        <div className="w-full overflow-x-auto h-full">
          <div
            className="z-0 h-full"
            style={{ minWidth: `${data.length * 60}px` }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={data}
                margin={{ top: 10, right: 5, left: 5, bottom: 5 }}
                barSize={10}
              >
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="2%" stopColor="#82ca9d" stopOpacity={0.7}/>
                  <stop offset="98%" stopColor="#82ca9d" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="id" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  fillOpacity={1}
                  fill="url(#colorUv)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );

  if (type === "Pie") {
    const COLORS = [
      "#60A5FA", // blue-400
      "#F87171", // red-400
      "#34D399", // green-400
      "#FBBF24", // yellow-400
      "#A78BFA", // purple-400
      "#F472B6", // pink-400
      "#10B981", // emerald-500
      "#FB923C", // orange-400
      "#C084FC", // violet-400
      "#4ADE80", // green-400 (alt)
    ];

    return (
      <div>
        <div
          className="panel p-2  grow text-xs py-2 "
          style={{ background: "white", color: "black" }}
        >
          <div className="font-bold text-lg">{name}</div>

          <div className="flex w-full gap-2 items-center flex-col">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart data={[...data]}>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="id"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  fill="#82ca9d"
                  label
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="flex flex-wrap gap-2 p-2 rounded-lg bg-white">
              {data.map((entry, index) => (
                <span
                  key={`cell-${index}`}
                  className={`font-mono `}
                  style={{ color: `${COLORS[index % COLORS.length]}` }}
                >
                  {entry.id}({entry.value})
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <div></div>;
}
