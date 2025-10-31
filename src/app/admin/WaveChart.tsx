// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type WaveChartProps = {
  data: {
    date: string;
    buyers: number;
    sellers: number;
  }[];
};

const CustomTooltip = ({ active, payload, label }: never) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium text-gray-900 mb-2">{label}</p>
        {payload.map(
          (
            entry: { color: string; dataKey: string; value: number },
            index: number
          ) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">
                {entry.dataKey === "buyers" ? "Buyers" : "Sellers"}:{" "}
                <span className="font-semibold text-gray-900">
                  {entry.value}
                </span>
              </span>
            </div>
          )
        )}
      </div>
    );
  }
  return null;
};

export default function WaveChart({ data }: WaveChartProps) {
  // Calculate dynamic Y-axis domain based on actual data
  const allValues = data.flatMap((item) => [item.buyers, item.sellers]);
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);

  // Add a small buffer (10%) for better visualization
  const buffer = (maxValue - minValue) * 0.1;
  const yAxisMin = Math.max(0, Math.floor(minValue - buffer));
  const yAxisMax = Math.ceil(maxValue + buffer);

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          className=""
          data={data}
          margin={{ top: 20, right: 0, left: -40, bottom: 20 }}
        >
          <CartesianGrid
            strokeDasharray="0"
            stroke="#f0f0f0"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            tickFormatter={(value) =>
              value >= 1000 ? `${value / 1000}k` : value
            }
            domain={[yAxisMin, yAxisMax]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="buyers"
            stroke="#6F41A4"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="sellers"
            stroke="#04171F"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
