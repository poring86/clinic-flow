"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

import { AppointmentsTableActions } from "./appointments-table-actions";

// Explicit type, compatible with backend/API return payload.
type AppointmentWithRelations = {
  id: string;
  clinicId: string;
  date: string;
  patient: {
    name: string;
  };
  doctor: {
    name: string;
    specialty: string;
  };
  // Add other required fields according to API response.
};

export const appointmentsTableColumns: ColumnDef<AppointmentWithRelations>[] = [
  {
    id: "patient",
    accessorKey: "patient.name",
    header: "Patient",
  },
  {
    id: "doctor",
    accessorKey: "doctor.name",
    header: "Doctor",
  },
  {
    id: "specialty",
    accessorKey: "doctor.specialty",
    header: "Specialty",
  },
  {
    id: "date",
    accessorKey: "date",
    header: "Date",
    cell: (params) => {
      const appointment = params.row.original;
      return dayjs(appointment.date).format("MMMM DD, YYYY");
    },
  },
  {
    id: "time",
    accessorKey: "date",
    header: "Time",
    cell: (params) => {
      const appointment = params.row.original;
      return dayjs(appointment.date).format("HH:mm");
    },
  },
  {
    id: "actions",
    cell: (params) => {
      const appointment = params.row.original;
      return <AppointmentsTableActions appointment={appointment} />;
    },
  },
];
