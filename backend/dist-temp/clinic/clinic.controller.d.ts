interface CreateClinicBody {
    name: string;
}
export declare class ClinicController {
    findAll(): {
        id: string;
        name: string;
    }[];
    create(body: CreateClinicBody): {
        name: string;
        id: string;
    };
}
export {};
