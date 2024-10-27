import Calendar from "@/components/calendar";
import { EventsProvider } from "@/context/events-context";

export default function Home() {
  return (
    <EventsProvider>
      <div className="px-4 py-4 md:px-8">
        <Calendar />
      </div>
    </EventsProvider>
  );
}
