import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

interface AnalyticsEvent {
  id: string;
  event_name: string;
  event_data: Record<string, unknown>;
  created_at: string;
}

export const useAnalytics = () => {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const trackEvent = async (eventName: string, eventData: Record<string, unknown> = {}) => {
    if (!user) return;

    try {
      const { error } = await supabase.from("analytics").insert({
        user_id: user.id,
        event_name: eventName,
        event_data: eventData,
      });

      if (error) throw error;

      // Refresh events after tracking
      await fetchEvents();
    } catch (error) {
      console.error("Error tracking event:", error);
    }
  };

  const fetchEvents = useCallback(
    async (limit = 50) => {
      if (!user) return;

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("analytics")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(limit);

        if (error) throw error;
        setEvents(data || []);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    },
    [user],
  );

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

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user, fetchEvents]);

  return {
    events,
    loading,
    trackEvent,
    fetchEvents,
    getEventsByType,
    getEventCounts,
  };
};
