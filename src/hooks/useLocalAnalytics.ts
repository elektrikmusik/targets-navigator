import { useState, useEffect } from "react";

interface AnalyticsEvent {
  id: string;
  event_name: string;
  event_data: Record<string, unknown>;
  created_at: string;
}

const ANALYTICS_STORAGE_KEY = "targets_navigator_analytics";

export const useLocalAnalytics = () => {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [loading, setLoading] = useState(false);

  // Load analytics from localStorage on mount
  useEffect(() => {
    setLoading(true);
    try {
      const savedEvents = localStorage.getItem(ANALYTICS_STORAGE_KEY);
      if (savedEvents) {
        const parsedEvents = JSON.parse(savedEvents);
        setEvents(parsedEvents);
      }
    } catch (error) {
      console.error("Error loading analytics from localStorage:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save analytics to localStorage whenever events change
  useEffect(() => {
    try {
      localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(events));
    } catch (error) {
      console.error("Error saving analytics to localStorage:", error);
    }
  }, [events]);

  const trackEvent = async (eventName: string, eventData: Record<string, unknown> = {}) => {
    const newEvent: AnalyticsEvent = {
      id: crypto.randomUUID(),
      event_name: eventName,
      event_data: eventData,
      created_at: new Date().toISOString(),
    };

    setEvents((prevEvents) => [newEvent, ...prevEvents.slice(0, 99)]); // Keep only last 100 events
  };

  const getEventsByType = (eventName: string) => {
    return events.filter((event) => event.event_name === eventName);
  };

  const getEventCounts = () => {
    const counts: Record<string, number> = {};
    events.forEach((event) => {
      counts[event.event_name] = (counts[event.event_name] || 0) + 1;
    });
    return counts;
  };

  const clearAnalytics = () => {
    setEvents([]);
  };

  return {
    events,
    loading,
    trackEvent,
    getEventsByType,
    getEventCounts,
    clearAnalytics,
  };
};
