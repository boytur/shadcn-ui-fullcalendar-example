"use client";

import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import multiMonthPlugin from "@fullcalendar/multimonth";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { useRef, useState } from "react";
import CalendarNav from "./calendar-nav";
import "@/styles/calendar.css";
import { PlusIcon } from "lucide-react";
import { useEvents } from "@/context/events-context";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "./ui/alert-dialog";
import { X } from "lucide-react";
import { EventDeleteForm } from "./event-delete-form";
import { EventEditForm } from "./event-edit-form";

export default function Calendar() {
  const { events } = useEvents();
  const { setEventAddOpen } = useEvents();

  const calendarRef = useRef<FullCalendar | null>(null);
  const [viewedDate, setViewedDate] = useState(new Date());
  const [selectedStart, setSelectedStart] = useState(new Date());
  const [selectedEnd, setSelectedEnd] = useState(new Date());

  const EventItem = ({ info }: any) => {
    const { event } = info;
    const [left, right] = info.timeText.split(" - ");

    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          {info.view.type == "dayGridMonth" ? (
            <div
              style={{ backgroundColor: info.backgroundColor }}
              className="p-1 flex flex-col space-y-0 overflow-hidden min-h-full min-w-full rounded-md cursor-pointer"
            >
              <p className="flex flex-row text-wrap font-semibold text-gray-950">
                {event.title}
              </p>
              <p className="flex text-gray-800">{left}</p>
              <p className="flex text-gray-800">{right}</p>
            </div>
          ) : (
            <div className="flex flex-col space-y-0 cursor-pointer">
              <p className="wrap font-semibold text-xs text-gray-950">
                {event.title}
              </p>
              <p className="flex text-gray-800 text-xs">{`${left} - ${right}`}</p>
              <p className="flex text-gray-800 text-xs"></p>
            </div>
          )}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex flex-row justify-between items-center">
              <h1>{event.title}</h1>
              <AlertDialogCancel>
                <X className="h-5 w-5" />
              </AlertDialogCancel>
            </AlertDialogTitle>
            <table>
              <tr>
                <th>Time:</th>
                <td>{info.timeText}</td>
              </tr>
              <tr>
                <th>Description:</th>
                <td>{event.extendedProps.description}</td>
              </tr>
              <tr>
                <th>Color:</th>
                <td>
                  <div
                    className="rounded-full w-5 h-5"
                    style={{ backgroundColor: info.backgroundColor }}
                  ></div>
                </td>
              </tr>
            </table>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <EventDeleteForm id={event.id} title={event.title} />
            <EventEditForm
              id={event.id}
              title={event.title}
              description={event.extendedProps.description}
              start={event.start}
              end={event.end}
              color={info.backgroundColor}
            />
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );

    if (info.view.type == "dayGridMonth") {
    } else {
      return (
        <div className="flex flex-col space-y-0 overflow-hidden min-h-full min-w-full rounded-md cursor-pointer outline-none">
          <p className="wrap font-semibold text-xs text-gray-950">
            {event.title}
          </p>
          <p className="flex text-gray-800 text-xs">{`${left} - ${right}`}</p>
          <p className="flex text-gray-800 text-xs"></p>
        </div>
      );
    }
  };

  const DayHeader = ({ info }: any) => {
    const [weekday, day] = info.text.split(" ");

    new Date(info.date).toDateString();

    return (
      <div className="flex h-full items-center overflow-hidden">
        {info.view.type == "timeGridDay" ? (
          <div className="flex flex-col rounded-sm">
            <p>{new Date(info.date).toDateString()}</p>
          </div>
        ) : info.view.type == "timeGridWeek" ? (
          <div className="flex flex-col rounded-sm">
            <p className="font-semibold">{weekday}</p>
            <p className="text-muted-foreground">{day}</p>
          </div>
        ) : (
          <div className="flex flex-col rounded-sm">
            <p>{weekday}</p>
          </div>
        )}
      </div>
    );
  };

  const DayRender = ({ info }: any) => {
    const [isHovering, setIsHovering] = useState(false);

    return (
      <div
        className="flex w-full h-full"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {isHovering ? (
          <div className="flex w-full h-full justify-center transition-opacity duration-100 ease-in-out opacity-0 hover:opacity-100">
            <PlusIcon className="h-5 w-5" />
          </div>
        ) : (
          info.dayNumberText
        )}
      </div>
    );
  };

  const handleDateSelect = (info: any) => {
    setSelectedStart(info.start);
    setSelectedEnd(info.end);
  };

  return (
    <>
      <CalendarNav
        calendarRef={calendarRef}
        start={selectedStart}
        end={selectedEnd}
        viewedDate={viewedDate}
      />

      <div className="p-5">
        <FullCalendar
          ref={calendarRef}
          timeZone="local"
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            multiMonthPlugin,
            interactionPlugin,
            listPlugin
          ]}
          aria-expanded={open}
          initialView="timeGridWeek"
          headerToolbar={false}
          slotMinTime={"08:00"}
          slotMaxTime={"24:00"}
          allDaySlot={false}
          firstDay={1}
          height={"75vh"}
          displayEventEnd={true}
          windowResizeDelay={0}
          events={events}
          slotLabelFormat={{
            hour: "numeric",
            minute: "2-digit",
            hour12: true
          }}
          eventTimeFormat={{
            hour: "numeric",
            minute: "2-digit",
            hour12: true
          }}
          eventBorderColor={"black"}
          contentHeight={"auto"}
          expandRows={true}
          dayCellContent={(dayInfo) => <DayRender info={dayInfo} />}
          eventContent={(eventInfo) => <EventItem info={eventInfo} />}
          dayHeaderContent={(headerInfo) => <DayHeader info={headerInfo} />}
          select={handleDateSelect}
          datesSet={(dates) => setViewedDate(dates.start)}
          dateClick={() => setEventAddOpen(true)}
          nowIndicator
          selectable
        />
      </div>
    </>
  );
}
