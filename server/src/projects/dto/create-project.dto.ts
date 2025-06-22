import { IsDate, IsDateString, IsNumber, IsString, MinLength } from "class-validator";

export class CreateProjectDto {

    @IsString()
    @MinLength(5)
    titre: string;

    @IsString()
    @MinLength(20)
    descritpion: string;

    @IsNumber()
    @MinLength(4)
    budget: number;

    @IsDateString()
    deadline: Date;

}
