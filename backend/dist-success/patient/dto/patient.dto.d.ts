import { PatientSex } from './create-patient.dto';
export declare class PatientDto {
    id: string;
    clinicId: string;
    name: string;
    email: string;
    phoneNumber: string;
    sex: PatientSex;
    createdAt: string;
    updatedAt: string;
}
