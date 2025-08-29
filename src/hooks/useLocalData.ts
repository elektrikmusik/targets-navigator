import { useState, useEffect } from "react";

interface DataItem {
  id: string;
  category: string;
  value: number;
  date: string;
  metadata: Record<string, unknown>;
}

const STORAGE_KEY = "targets_navigator_data";

export const useLocalData = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    setLoading(true);
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setData(parsedData);
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save data to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving data to localStorage:", error);
    }
  }, [data]);

  const addDataPoint = async (
    category: string,
    value: number,
    metadata: Record<string, unknown> = {},
  ) => {
    const newItem: DataItem = {
      id: crypto.randomUUID(),
      category,
      value,
      date: new Date().toISOString(),
      metadata,
    };

    setData((prevData) => [newItem, ...prevData]);
  };

  const updateDataPoint = async (id: string, updates: Partial<DataItem>) => {
    setData((prevData) =>
      prevData.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    );
  };

  const deleteDataPoint = async (id: string) => {
    setData((prevData) => prevData.filter((item) => item.id !== id));
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
    const categories = ["Sales", "Marketing", "Support", "Development", "Design"];
    const samplePoints: DataItem[] = [];

    for (let i = 0; i < 20; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const value = Math.floor(Math.random() * 100) + 1;
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));

      samplePoints.push({
        id: crypto.randomUUID(),
        category,
        value,
        date: date.toISOString(),
        metadata: { generated: true, batch: Date.now() },
      });
    }

    setData((prevData) => [...samplePoints, ...prevData]);
  };

  const clearAllData = () => {
    setData([]);
  };

  return {
    data,
    loading,
    addDataPoint,
    updateDataPoint,
    deleteDataPoint,
    getDataByCategory,
    getCategorySummary,
    generateSampleData,
    clearAllData,
  };
};
