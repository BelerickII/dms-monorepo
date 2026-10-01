import { IsEmail, IsNotEmpty, IsNumberString, IsString } from "class-validator";
import { Trim } from "../../common/trim.decorator";

export class createStaffDto {
    @Trim()
    @IsNotEmpty() 
    @IsNumberString()  
    staffID: string;     
    
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