import { IsEmail, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum PatientSex {
  MALE = 'male',
  FEMALE = 'female',
}

export class CreatePatientDto {
  @ApiProperty()
  @IsNotEmpty()
  name!: string;

  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsNotEmpty()
  phoneNumber!: string;

  @ApiProperty({ enum: PatientSex })
  @IsEnum(PatientSex)
  sex!: PatientSex;

  @ApiProperty({ format: 'uuid' })
  @IsNotEmpty()
  clinicId!: string;
}
