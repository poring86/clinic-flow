export declare enum PatientSex {
    MALE = "male",
    FEMALE = "female"
}
export declare class CreatePatientDto {
    name: string;
    email: string;
    phoneNumber: string;
    sex: PatientSex;
    clinicId: string;
}
