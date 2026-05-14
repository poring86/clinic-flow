"use client";

import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";

import { AddPatientButton } from "../components/add-patient-button";
import { PatientsClient } from "../components/patients-client";

interface PatientsPageProps {
  clinicId: string;
}

export const PatientsPage = ({ clinicId }: PatientsPageProps) => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Patients</PageTitle>
          <PageDescription>Manage the patients in your clinic.</PageDescription>
        </PageHeaderContent>

        <PageActions>
          <AddPatientButton clinicId={clinicId} />
        </PageActions>
      </PageHeader>
      <PageContent>
        <PatientsClient clinicId={clinicId} />
      </PageContent>
    </PageContainer>
  );
};