import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

interface SampleDataItem {
  id: string;
  category: string;
  value: number;
  date: string;
  metadata: Record<string, unknown>;
}

export const useSampleData = () => {
  const [data, setData] = useState<SampleDataItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchData = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data: sampleData, error } = await supabase
        .from("sample_data")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (error) throw error;
      setData(sampleData || []);
    } catch (error) {
      console.error("Error fetching sample data:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addDataPoint = async (
    category: string,
    value: number,
    metadata: Record<string, unknown> = {},
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase.from("sample_data").insert({
        user_id: user.id,
        category,
        value,
        metadata,
      });

      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error("Error adding data point:", error);
      throw error;
    }
  };

  const updateDataPoint = async (id: string, updates: Partial<SampleDataItem>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("sample_data")
        .update(updates)
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error("Error updating data point:", error);
      throw error;
    }
  };

  const deleteDataPoint = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("sample_data")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error("Error deleting data point:", error);
      throw error;
    }
  };

  const getDataByCategory = (category: string) => {
    return data.filter((item) => item.category === category);
  };

  const getCategorySummary = () => {
    const summary: Record<string, { count: number; total: number; average: number }> = {};

    data.forEach((item) => {
      if (!summary[item.category]) {
        summary[item.category] = { count: 0, total: 0, average: 0 };
      }
      summary[item.category].count++;
      summary[item.category].total += item.value;
    });

    Object.keys(summary).forEach((category) => {
      summary[category].average = summary[category].total / summary[category].count;
    });

    return summary;
  };

  const generateSampleData = async () => {
    if (!user) return;

    const categories = ["Sales", "Marketing", "Support", "Development", "Design"];
    const samplePoints = [];

    for (let i = 0; i < 20; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const value = Math.floor(Math.random() * 100) + 1;
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));

      samplePoints.push({
        user_id: user.id,
        category,
        value,
        date: date.toISOString(),
        metadata: { generated: true, batch: Date.now() },
      });
    }

    try {
      const { error } = await supabase.from("sample_data").insert(samplePoints);

      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error("Error generating sample data:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchData]);

  return {
    data,
    loading,
    fetchData,
    addDataPoint,
    updateDataPoint,
    deleteDataPoint,
    getDataByCategory,
    getCategorySummary,
    generateSampleData,
  };
};
