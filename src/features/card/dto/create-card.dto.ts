import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateCardDTO {
  @IsNotEmpty()
  @MaxLength(20)
  label: string;
  @IsNotEmpty()
  firstName: string;
  lastName: string;
  jobTitle: string;
  company: string;
  user: string;
}
