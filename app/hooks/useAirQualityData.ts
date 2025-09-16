"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface AirQualityTrend {
  id: string;
  date: string;
  coGt: number;
  pt08S1Co: number;
  nmhcGt: number;
  c6h6Gt: number;
  pt08S2Nmhc: number;
  noxGt: number;
  pt08S4No2: number;
  pt08S5O3: number;
  t: number;
  rh: number;
  ah: number;
  category:
    | "Good"
    | "Moderate"
    | "Unhealthy for Sensitive"
    | "Unhealthy"
    | "Very Unhealthy"
    | "Hazardous";
}

const fetchTrendData = async (
  frequency: string
): Promise<{ data: AirQualityTrend[] }> => {
  try {
    const res = await fetch(
      `http://localhost:3001/air-quality/all?start_date=2004-03-01&frequency=${frequency}`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching trend data:", error);
    return { data: [] };
  }
};

export const useTrendData = (
  frequency: "daily" | "weekly" | "monthly" | "hourly" = "monthly"
) => {
  return useQuery({
    queryKey: ["airQuality", "trends", frequency],
    queryFn: () => fetchTrendData(frequency),
    select: (json: { data }): AirQualityTrend[] =>
      json.data.map((item) => ({
        date: item.aq_date?.slice(0, 10),
        time: item.aq_time?.slice(0, 5),
        coGt: item.aq_co_gt,
        pt08S1Co: item.aq_pt08_s1_co,
        nmhcGt: item.aq_nmhc_gt,
        c6h6Gt: item.aq_c6h6_gt,
        pt08S2Nmhc: item.aq_pt08_s2_nmhc,
        noxGt: item.aq_nox_gt,
        pt08S4No2: item.aq_pt08_s4_no2,
        pt08S5O3: item.aq_pt08_s5_o3,
        t: item.aq_t,
        rh: item.aq_rh,
        ah: item.aq_ah,
        category: item.category,
      })),
    refetchInterval: 10 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
  });
};

// Example mutation for updating sensor settings (you can expand this)
export const useUpdateSensorSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: { sensorId: string; interval: number }) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return settings;
    },
    onSuccess: () => {
      // Invalidate and refetch current readings after updating settings
      queryClient.invalidateQueries({ queryKey: ["airQuality", "current"] });
    },
  });
};
