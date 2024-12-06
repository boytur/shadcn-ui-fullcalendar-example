"use client";

import { useEvents } from "@/context/events-context";
import "@/styles/calendar.css";
import {
  DateSelectArg,
  DayCellContentArg,
  DayHeaderContentArg,
  EventContentArg,
} from "@fullcalendar/core/index.js";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import multiMonthPlugin from "@fullcalendar/multimonth";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { X } from "lucide-react";
import { useRef, useState } from "react";
import CalendarNav from "./calendar-nav";
import { EventDeleteForm } from "./event-delete-form";
import { EventEditForm } from "./event-edit-form";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { earliestTime, latestTime } from "@/utils/data";
import { getDateFromMinutes } from "@/lib/utils";

type EventItemProps = {
  info: EventContentArg;
};

type DayHeaderProps = {
  info: DayHeaderContentArg;
};

type DayRenderProps = {
  info: DayCellContentArg;
};

export default function Calendar() {
  const { events, setEventAddOpen } = useEvents();

  const calendarRef = useRef<FullCalendar | null>(null);
  const [viewedDate, setViewedDate] = useState(new Date());
  const [selectedStart, setSelectedStart] = useState(new Date());
  const [selectedEnd, setSelectedEnd] = useState(new Date());

  const EventItem = ({ info }: EventItemProps) => {
    const { event } = info;
    const [left, right] = info.timeText.split(" - ");

    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          {info.view.type == "dayGridMonth" ? (
            <div
              style={{ backgroundColor: info.backgroundColor }}
              className="flex flex-col rounded-md w-full px-1 pb-2 cursor-pointer line-clamp-1"
            >
              {/* <div className="flex flex-row w-5/6"> */}
              <p className="font-semibold text-xs text-gray-950 line-clamp-1 w-5/6">
                {event.title}
              </p>
              {/* </div> */}

              <p className="text-gray-800 text-xs">{left}</p>
              <p className="text-gray-800 text-xs">{right}</p>
            </div>
          ) : (
            <div className="flex flex-col space-y-0 cursor-pointer">
              <p className="font-semibold w-full text-xs text-gray-950 line-clamp-1">
                {event.title}
              </p>
              <p className="text-gray-800 text-xs line-clamp-1">{`${left} - ${right}`}</p>
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
  };

  const DayHeader = ({ info }: DayHeaderProps) => {
    const [weekday] = info.text.split(" ");

    return (
      <div className="flex items-center h-full overflow-hidden">
        {info.view.type == "timeGridDay" ? (
          <div className="flex flex-col rounded-sm">
            <p>
              {info.date.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        ) : info.view.type == "timeGridWeek" ? (
          <div className="flex flex-col rounded-sm items-center w-full">
            <p className="font-semibold">{weekday}</p>
            {info.isToday ? (
              <div className="flex bg-black dark:bg-white h-6 w-6 rounded-full items-center justify-center">
                <p className="font-light dark:text-black text-white">
                  {info.date.getDate()}
                </p>
              </div>
            ) : (
              <div className="h-6 w-6 rounded-full items-center justify-center">
                <p className="font-light">{info.date.getDate()}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col rounded-sm">
            <p>{weekday}</p>
          </div>
        )}
      </div>
    );
  };

  const DayRender = ({ info }: DayRenderProps) => {
    return (
      <div className="flex">
        {info.view.type == "dayGridMonth" && info.isToday ? (
          <div className="flex h-7 w-7 rounded-full bg-black light:bg-white items-center justify-center text-sm text-white light:text-black">
            {info.dayNumberText}
          </div>
        ) : (
          <div className="flex h-7 w-7 rounded-full items-center justify-center text-sm">
            {info.dayNumberText}
          </div>
        )}
      </div>
    );
  };

  const handleDateSelect = (info: DateSelectArg) => {
    setSelectedStart(info.start);
    setSelectedEnd(info.end);
  };

  const earliestHour = getDateFromMinutes(earliestTime)
    .getHours()
    .toString()
    .padStart(2, "0");
  const earliestMin = getDateFromMinutes(earliestTime)
    .getMinutes()
    .toString()
    .padStart(2, "0");
  const latestHour = getDateFromMinutes(latestTime)
    .getHours()
    .toString()
    .padStart(2, "0");
  const latestMin = getDateFromMinutes(latestTime)
    .getMinutes()
    .toString()
    .padStart(2, "0");

  const calendarEarliestTime = `${earliestHour}:${earliestMin}`;
  const calendarLatestTime = `${latestHour}:${latestMin}`;

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
            listPlugin,
          ]}
          initialView="timeGridWeek"
          headerToolbar={false}
          slotMinTime={calendarEarliestTime}
          slotMaxTime={calendarLatestTime}
          allDaySlot={false}
          firstDay={1}
          height={45}
          displayEventEnd={true}
          windowResizeDelay={0}
          events={events}
          slotLabelFormat={{
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }}
          eventTimeFormat={{
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
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
