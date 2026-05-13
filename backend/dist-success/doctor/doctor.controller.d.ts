import { CreateDoctorDto } from './dto/create-doctor.dto';
import { DoctorDto } from './dto/doctor.dto';
import { DoctorService } from './doctor.service';
export declare class DoctorController {
    private readonly doctorService;
    constructor(doctorService: DoctorService);
    findAll(clinicId?: string): Promise<DoctorDto[]>;
    create(body: CreateDoctorDto): Promise<DoctorDto>;
    update(id: string, body: CreateDoctorDto): Promise<DoctorDto | null>;
    delete(id: string): Promise<{
        success: boolean;
    }>;
}
