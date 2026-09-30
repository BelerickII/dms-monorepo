import { IsEmail, IsEnum, IsInt, IsNotEmpty, IsNumber, IsNumberString, IsString } from "class-validator";
import { Department, ModeOfEntry } from "../../common/enums";
import { Trim } from "../../common/trim.decorator";
import { Type } from "class-transformer";

export class createStudentDto {
    @Trim()
    @IsNotEmpty()
    @IsNumberString()
    matric_no: string;

    @Trim()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @Trim()
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @Trim()
    @IsNotEmpty()
    @IsString()
    lastName: string;

    @Trim()
    @IsNotEmpty()
    @IsString()
    password: string;

    @Trim()
    @IsNotEmpty()
    @IsEnum(Department)
    department: Department;

    @Trim()
    @IsNotEmpty()
    @IsEnum(ModeOfEntry)
    mode_of_entry: ModeOfEntry;

    @Trim()
    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    level: number;
}