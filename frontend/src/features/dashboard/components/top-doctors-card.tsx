"use client";

import { useDashboardTopDoctorsViewModel } from "@/features/dashboard/hooks";

import { TopDoctors } from ".";

interface TopDoctorsCardProps {
  clinicId: string;
  from: string;
  to: string;
}

export const TopDoctorsCard = ({
  clinicId,
  from,
  to,
}: TopDoctorsCardProps) => {
  const { doctors, isLoading, error } = useDashboardTopDoctorsViewModel({
    clinicId,
    from,
    to,
  });

  const normalizedDoctors = doctors.map((doctor) => ({
    id: doctor.doctorId,
    name: doctor.name,
    avatarImageUrl: null,
    specialty: doctor.specialty,
    appointments: doctor.appointmentCount,
  }));

  if (isLoading) {
    return <div className="h-80 bg-muted animate-pulse rounded" />;
  }

  if (error) {
    return (
      <div className="p-4 bg-destructive/10 text-destructive rounded">
        Failed to load top doctors
      </div>
    );
  }

  return <TopDoctors doctors={normalizedDoctors} />;
};
