'use client'
import AirQualityChart from '../components/AirQualityChart';

export default function Dashboard() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Air Quality Dashboard</h1>
          <p className="text-gray-600">Real-time environmental monitoring and analysis</p>
        </div>

        <div className="flex flex-col space-y-8">
          <AirQualityChart />
        </div>
      </div>
    </div>
  );
}
