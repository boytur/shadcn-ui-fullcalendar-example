import AvailabilityChecker from "@/components/availability-checker";
import Calendar from "@/components/calendar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventsProvider } from "@/context/events-context";

export default function Home() {
  return (
    <EventsProvider>
      <div className="py-4">
        <Tabs
          defaultValue="calendar"
          className="flex flex-col w-screen items-center"
        >
          <TabsList className="flex justify-center mb-2">
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="schedulingAssistant">
              Scheduling Assistant
            </TabsTrigger>
          </TabsList>
          <TabsContent value="calendar" className="w-full px-5 space-y-5">
            <h2 className="flex items-center text-2xl font-semibold tracking-tight md:text-3xl">
              Calendar
            </h2>
            <Separator />
            <Calendar />
          </TabsContent>
          <TabsContent
            value="schedulingAssistant"
            className="w-full px-5 space-y-5"
          >
            <h2 className="flex items-center text-2xl font-semibold tracking-tight md:text-3xl">
              Scheduling Assistant
            </h2>
            <Separator />
            <AvailabilityChecker />
          </TabsContent>
        </Tabs>
      </div>
    </EventsProvider>
  );
}
