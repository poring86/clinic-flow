import { DoctorDto } from './dto/doctor.dto';
export declare class DoctorService {
    findAll(clinicId?: string): Promise<DoctorDto[]>;
    delete(id: string): Promise<boolean>;
    update(id: string, data: Partial<Omit<DoctorDto, 'id' | 'createdAt' | 'updatedAt'>>): Promise<DoctorDto | null>;
    create(data: Omit<DoctorDto, 'id' | 'createdAt' | 'updatedAt'>): Promise<DoctorDto>;
}
