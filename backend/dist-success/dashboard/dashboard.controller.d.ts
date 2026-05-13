import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    private validateClinicId;
    private validateRange;
    getSummary(clinicId: string, from: string, to: string): Promise<{
        totalRevenue: {
            total: number;
        };
        totalAppointments: {
            total: number;
        };
        totalPatients: {
            total: number;
        };
        totalDoctors: {
            total: number;
        };
    }>;
    getTopDoctors(clinicId: string, from: string, to: string): Promise<{
        id: string;
        name: string;
        avatarImageUrl: string | null;
        specialty: string;
        appointments: number;
    }[]>;
    getTopSpecialties(clinicId: string, from: string, to: string): Promise<{
        specialty: string;
        appointments: number;
    }[]>;
    getTodayAppointments(clinicId: string): Promise<{
        id: string;
        date: Date;
        appointmentPriceInCents: number;
        patientId: string;
        doctorId: string;
        clinicId: string;
        createdAt: Date;
        updatedAt: Date | null;
        patient: {
            name: string;
        };
        doctor: {
            name: string;
            specialty: string;
        };
    }[]>;
    getDailyAppointmentsData(clinicId: string, from: string, to: string): Promise<{
        date: string;
        appointments: number;
        revenue: string | null;
    }[]>;
}
