import { AppointmentDto } from './dto/appointment.dto';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
export declare class AppointmentService {
    findAll(clinicId?: string): Promise<AppointmentDto[]>;
    create(data: CreateAppointmentDto): Promise<AppointmentDto>;
    delete(id: string): Promise<boolean>;
}
