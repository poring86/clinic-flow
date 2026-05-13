import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentDto } from './dto/appointment.dto';
import { AppointmentService } from './appointment.service';
export declare class AppointmentController {
    private readonly appointmentService;
    constructor(appointmentService: AppointmentService);
    findAll(clinicId?: string): Promise<AppointmentDto[]>;
    create(body: CreateAppointmentDto): Promise<AppointmentDto>;
    delete(id: string): Promise<{
        success: boolean;
    }>;
}
