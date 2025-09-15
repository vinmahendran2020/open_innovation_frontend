'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Types for air quality data
export interface AirQualityReading {
  id: string;
  location: string;
  timestamp: string;
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  aqi: number;
  category: 'Good' | 'Moderate' | 'Unhealthy for Sensitive' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
}

export interface AirQualityTrend {
  time: string;
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
}

// Simulate API calls (replace with real API endpoints later)
const fetchCurrentReadings = async (): Promise<AirQualityReading[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    {
      id: '1',
      location: 'Downtown',
      timestamp: new Date().toISOString(),
      pm25: 25,
      pm10: 35,
      no2: 32,
      o3: 45,
      aqi: 85,
      category: 'Moderate'
    },
    {
      id: '2',
      location: 'Suburb A',
      timestamp: new Date().toISOString(),
      pm25: 12,
      pm10: 18,
      no2: 22,
      o3: 38,
      aqi: 42,
      category: 'Good'
    },
    {
      id: '3',
      location: 'Industrial',
      timestamp: new Date().toISOString(),
      pm25: 45,
      pm10: 58,
      no2: 62,
      o3: 28,
      aqi: 125,
      category: 'Unhealthy for Sensitive'
    },
    {
      id: '4',
      location: 'Park Area',
      timestamp: new Date().toISOString(),
      pm25: 8,
      pm10: 12,
      no2: 15,
      o3: 42,
      aqi: 28,
      category: 'Good'
    },
    {
      id: '5',
      location: 'Highway',
      timestamp: new Date().toISOString(),
      pm25: 35,
      pm10: 42,
      no2: 48,
      o3: 32,
      aqi: 95,
      category: 'Moderate'
    }
  ];
};

const fetchTrendData = async (): Promise<AirQualityTrend[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return [
    { time: '00:00', pm25: 12, pm10: 18, no2: 25, o3: 45 },
    { time: '04:00', pm25: 15, pm10: 22, no2: 28, o3: 48 },
    { time: '08:00', pm25: 35, pm10: 42, no2: 45, o3: 35 },
    { time: '12:00', pm25: 28, pm10: 35, no2: 38, o3: 55 },
    { time: '16:00', pm25: 42, pm10: 48, no2: 52, o3: 42 },
    { time: '20:00', pm25: 25, pm10: 30, no2: 32, o3: 38 },
  ];
};

// Custom hooks using TanStack Query
export const useCurrentReadings = () => {
  return useQuery({
    queryKey: ['airQuality', 'current'],
    queryFn: fetchCurrentReadings,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 2 * 60 * 1000, // Data is fresh for 2 minutes
  });
};

export const useTrendData = () => {
  return useQuery({
    queryKey: ['airQuality', 'trends'],
    queryFn: fetchTrendData,
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
    staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
  });
};

// Example mutation for updating sensor settings (you can expand this)
export const useUpdateSensorSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (settings: { sensorId: string; interval: number }) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return settings;
    },
    onSuccess: () => {
      // Invalidate and refetch current readings after updating settings
      queryClient.invalidateQueries({ queryKey: ['airQuality', 'current'] });
    },
  });
};

// Hook to get aggregated statistics
export const useAirQualityStats = () => {
  const { data: readings, isLoading, error } = useCurrentReadings();
  
  const stats = {
    averageAQI: 0,
    totalSensors: 0,
    healthySensors: 0,
    unhealthySensors: 0,
  };
  
  if (readings && readings.length > 0) {
    stats.averageAQI = Math.round(
      readings.reduce((sum, reading) => sum + reading.aqi, 0) / readings.length
    );
    stats.totalSensors = readings.length;
    stats.healthySensors = readings.filter(r => r.aqi <= 50).length;
    stats.unhealthySensors = readings.filter(r => r.aqi > 100).length;
  }
  
  return {
    data: stats,
    isLoading,
    error,
  };
};