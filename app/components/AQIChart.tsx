'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useCurrentReadings } from '../hooks/useAirQualityData';

// Function to get color based on AQI value
const getAQIColor = (aqi: number) => {
  if (aqi <= 50) return '#10b981'; // Good - Green
  if (aqi <= 100) return '#f59e0b'; // Moderate - Yellow
  if (aqi <= 150) return '#ef4444'; // Unhealthy for Sensitive - Red
  return '#7c2d12'; // Unhealthy - Dark Red
};

export default function AQIChart() {
  const { data: readings, isLoading, error } = useCurrentReadings();

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Current Air Quality Index by Location
        </h3>
        <div className="h-80 flex items-center justify-center">
          <div className="text-gray-500">Loading AQI data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Current Air Quality Index by Location
        </h3>
        <div className="h-80 flex items-center justify-center">
          <div className="text-red-500">Error loading AQI data</div>
        </div>
      </div>
    );
  }

  // Transform the readings data for the chart
  const aqiData = readings?.map(reading => ({
    location: reading.location,
    aqi: reading.aqi,
    category: reading.category
  })) || [];
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Current Air Quality Index by Location
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={aqiData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="location" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              label={{ value: 'AQI Value', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#f9fafb', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
              formatter={(value, name, props) => [
                `AQI: ${value}`,
                `Category: ${props.payload.category}`
              ]}
            />
            <Bar 
              dataKey="aqi" 
              fill={(entry: any) => getAQIColor(entry.aqi)}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* AQI Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
          <span>Good (0-50)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
          <span>Moderate (51-100)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
          <span>Unhealthy (101-150)</span>
        </div>
      </div>
    </div>
  );
}