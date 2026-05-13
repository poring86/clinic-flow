import { PatientDto } from './dto/patient.dto';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
export declare class PatientService {
    delete(id: string): Promise<boolean>;
    findAll(clinicId?: string): Promise<PatientDto[]>;
    create(dto: CreatePatientDto): Promise<PatientDto>;
    update(id: string, dto: UpdatePatientDto): Promise<PatientDto | null>;
}
