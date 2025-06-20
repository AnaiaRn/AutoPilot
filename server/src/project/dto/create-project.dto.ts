import { IsDateString, IsNumber, IsString, Min, MinLength } from "class-validator";

export class CreateProjectDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsDateString()
  deadline: string;

  @IsNumber()
  @Min(0)
  budget: number;
}