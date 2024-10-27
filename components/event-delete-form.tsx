"use client";

import React from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { useEvents } from "@/context/events-context";
import { ToastAction } from "./ui/toast";

interface EventDeleteFormProps {
  id: string;
  title: string;
}

export function EventDeleteForm({ id, title }: EventDeleteFormProps) {
  const { deleteEvent } = useEvents();
  // const { eventDeleteOpen, setEventDeleteOpen } = useEvents();

  const { toast } = useToast();

  async function onSubmit() {
    deleteEvent(id);
    toast({
      title: "Event deleted!",
      action: (
        <ToastAction altText={"Dismiss notification."}>Dismiss</ToastAction>
      )
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete Event</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex flex-row justify-between items-center">
            <h1>Delete {title}</h1>
          </AlertDialogTitle>
          Are you sure you want to delete this event?
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant="destructive" onClick={() => onSubmit()}>
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
