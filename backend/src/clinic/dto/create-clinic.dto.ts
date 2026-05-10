import { IsNotEmpty, IsString } from 'class-validator';

export class CreateClinicDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
