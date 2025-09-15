import AirQualityChart from '../components/AirQualityChart';
import AQIChart from '../components/AQIChart';
import { useAirQualityStats } from '../hooks/useAirQualityData';

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useAirQualityStats();
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Air Quality Dashboard</h1>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AirQualityChart />
          <AQIChart />
        </div>
      </div>
    </div>
  );
}
