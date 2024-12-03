"use client";
import { initialEvents } from "@/utils/data";
import React, { createContext, ReactNode, useContext, useState } from "react";

interface Event {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  color: string;
}

interface EventsContextType {
  events: Event[];
  addEvent: (event: Event) => void;
  deleteEvent: (id: string) => void;
  eventAddOpen: boolean;
  setEventAddOpen: (value: boolean) => void;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error("useEvents must be used within an EventsProvider");
  }
  return context;
};

export const EventsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [events, setEvents] = useState<Event[]>(
    initialEvents.map((event) => ({
      ...event,
      id: String(event.id),
      color: event.backgroundColor,
    }))
  );
  const [eventAddOpen, setEventAddOpen] = useState(false);

  const addEvent = (event: Event) => {
    setEvents((prevEvents) => [...prevEvents, event]);
  };

  const deleteEvent = (id: string) => {
    setEvents((prevEvents) =>
      prevEvents.filter((event) => Number(event.id) !== Number(id))
    );
  };

  return (
    <EventsContext.Provider
      value={{ events, addEvent, deleteEvent, eventAddOpen, setEventAddOpen }}
    >
      {children}
    </EventsContext.Provider>
  );
};
