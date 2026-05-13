import { CreatePatientDto } from './dto/create-patient.dto';
import { PatientDto } from './dto/patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientService } from './patient.service';
export declare class PatientController {
    private readonly patientService;
    constructor(patientService: PatientService);
    findAll(clinicId?: string): Promise<PatientDto[]>;
    create(dto: CreatePatientDto): Promise<PatientDto>;
    update(id: string, dto: UpdatePatientDto): Promise<PatientDto | null>;
    delete(id: string): Promise<{
        success: boolean;
    }>;
}
