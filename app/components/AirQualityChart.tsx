'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTrendData } from '../hooks/useAirQualityData';

export default function AirQualityChart() {
  const { data: airQualityData, isLoading, error } = useTrendData();

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
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Air Quality Trends (24 Hours)
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={airQualityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip 
              labelClassName="text-gray-700"
              contentStyle={{ 
                backgroundColor: '#f9fafb', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="pm25" 
              stroke="#ef4444" 
              strokeWidth={2}
              name="PM2.5 (μg/m³)"
            />
            <Line 
              type="monotone" 
              dataKey="pm10" 
              stroke="#f97316" 
              strokeWidth={2}
              name="PM10 (μg/m³)"
            />
            <Line 
              type="monotone" 
              dataKey="no2" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="NO₂ (μg/m³)"
            />
            <Line 
              type="monotone" 
              dataKey="o3" 
              stroke="#10b981" 
              strokeWidth={2}
              name="O₃ (μg/m³)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}