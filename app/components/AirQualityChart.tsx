"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTrendData } from "../hooks/useAirQualityData";
import { CustomLegend } from "./Legend";
import { useState } from "react";

export default function AirQualityChart() {

  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly" | 'hourly'>(
    "monthly"
  );

  const { data: airQualityData, isLoading, error } = useTrendData(frequency);

  console.log("Air Quality Data:", airQualityData);
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Air Quality Trends (24 Hours)
        </h3>
        <div className="h-80 flex items-center justify-center">
          <div className="text-gray-500">Loading chart data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Air Quality Trends (24 Hours)
        </h3>
        <div className="h-80 flex items-center justify-center">
          <div className="text-red-500">Error loading chart data</div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Air Quality Trends (24 Hours)
        </h3>
        <select
          value={frequency}
          onChange={(e) =>
            setFrequency(e.target.value as "daily" | "weekly" | "monthly")
          }
          className="border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="hourly">Hourly</option>
        </select>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={airQualityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={frequency === 'hourly' ? 'time' : 'date'} />
            <YAxis />
            <Tooltip
              labelClassName="text-gray-700"
              contentStyle={{
                backgroundColor: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Line
              type="monotone"
              dataKey="coGt"
              stroke="#ef4444"
              strokeWidth={2}
              name="CO (μg/m³)"
            />
            <Line
              type="monotone"
              dataKey="nmhcGt"
              stroke="#f97316"
              strokeWidth={2}
              name="NMHC (μg/m³)"
            />
            <Line
              type="monotone"
              dataKey="noxGt"
              stroke="#3b82f6"
              strokeWidth={2}
              name="NOx (μg/m³)"
            />
            <Line
              type="monotone"
              dataKey="pt08S4No2"
              stroke="#8b5cf6"
              strokeWidth={2}
              name="NO2 (μg/m³)"
            />
            <Line
              type="monotone"
              dataKey="pt08S5O3"
              stroke="#10b981"
              strokeWidth={2}
              name="O₃ (μg/m³)"
            />
            <Legend content={<CustomLegend />} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
