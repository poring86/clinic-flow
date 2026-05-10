"use client";

import { useQuery } from "@tanstack/react-query";

import type { DoctorDto as Doctor } from "@/api/schemas";
import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { getApiBaseUrl } from "@/lib/api-base-url";

import { AddDoctorButton } from "../components/add-doctor-button";
import { DoctorCard } from "../components/doctor-card";
import { doctorsQueryKeys } from "../query-keys";

interface DoctorsPageProps {
  clinicId: string;
}

export const DoctorsPage = ({ clinicId }: DoctorsPageProps) => {
  const baseUrl = getApiBaseUrl();

  const { data: doctorsList = [] } = useQuery({
    queryKey: doctorsQueryKeys.listByClinic(clinicId),
    enabled: !!clinicId,
    queryFn: async () => {
      const doctorsUrl = `${baseUrl}/doctor?clinicId=${encodeURIComponent(clinicId)}`;
      const doctorsRes = await fetch(doctorsUrl, { method: "GET" });

      if (!doctorsRes.ok) {
        throw new Error("Failed to fetch doctors");
      }

      return (await doctorsRes.json()) as Doctor[];
    },
    select: (data) =>
      [...data].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      ),
  });

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Médicos</PageTitle>
          <PageDescription>Gerencie os médicos em sua clínica.</PageDescription>
        </PageHeaderContent>

        <PageActions>
          <AddDoctorButton clinicId={clinicId} />
        </PageActions>
      </PageHeader>
      <PageContent>
        <div className="grid grid-cols-3 gap-6">
          {doctorsList.map((doctor, index) => (
            <DoctorCard
              key={doctor.id?.trim() || `${doctor.name}-${doctor.specialty}-${index}`}
              doctor={doctor}
            />
          ))}
        </div>
      </PageContent>
    </PageContainer>
  );
};