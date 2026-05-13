import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    deleteSession(token: string): Promise<{
        success: boolean;
    }>;
    register(dto: RegisterDto): Promise<{
        id: string;
        email: string;
        name: string;
    }>;
    login(dto: LoginDto): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            name: string;
        };
    }>;
    findOrCreateGoogleUser(googleUser: {
        email: string;
        name: string;
        picture: string | null;
        accessToken: string;
    }): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            name: string;
        };
    }>;
    getSession(token: string): Promise<{
        id: string;
        email: string;
        name: string;
        clinicId: string;
    }>;
}
