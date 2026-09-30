import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Trim } from "../../common/trim.decorator";

export class createUserDto {
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
}