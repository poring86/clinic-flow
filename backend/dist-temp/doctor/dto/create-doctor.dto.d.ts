export declare class CreateDoctorDto {
    clinicId: string;
    name: string;
    avatarImageUrl?: string;
    availableFromWeekDay: number;
    availableToWeekDay: number;
    availableFromTime: string;
    availableToTime: string;
    specialty: string;
    appointmentPriceInCents: number;
}
