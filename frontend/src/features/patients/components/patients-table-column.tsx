"use client";

import { ColumnDef } from "@tanstack/react-table";
import { PatternFormat } from "react-number-format";

import type { PatientDto as Patient } from "@/api/schemas";

import { PatientsTableActions } from "./patients-table-actions";

export const patientsTableColumns: ColumnDef<Patient>[] = [
  {
    id: "select",
    accessorKey: "name",
    header: "Name",
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "phoneNumber",
    accessorKey: "phoneNumber",
    header: "Phone Number",
    cell: (params) => {
      const patient = params.row.original;
      return (
        <PatternFormat
          value={patient.phoneNumber}
          format="(##) #####-####"
          mask="_"
          displayType="text"
        />
      );
    },
  },
  {
    id: "sex",
    accessorKey: "sex",
    header: "Sex",
    cell: (params) => {
      const patient = params.row.original;
      return patient.sex === "male" ? "Male" : "Female";
    },
  },
  {
    id: "actions",
    cell: (params) => {
      const patient = params.row.original;
      return <PatientsTableActions patient={patient} />;
    },
  },
];
