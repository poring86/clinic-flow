import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
type GoogleAuthUser = {
    email: string;
    name: string;
    picture: string | null;
    accessToken: string;
};
type GoogleAuthRequest = Request & {
    user: GoogleAuthUser;
};
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    session(token: string): Promise<{
        id: string;
        email: string;
        name: string;
        clinicId: string;
    }>;
    deleteSession(token: string): Promise<{
        success: boolean;
    }>;
    googleLogin(): void;
    googleCallback(req: GoogleAuthRequest, res: Response): Promise<void>;
}
export {};
