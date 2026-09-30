import { IsEnum, IsInt, IsNotEmpty } from "class-validator";
import { Department } from "../../common/enums";
import { Type } from "class-transformer";
import { Trim } from "../../common/trim.decorator";

export class createDepartmentDto {
    @Trim()
    @IsNotEmpty()
    @IsEnum(Department)
    department: Department;

    @Trim()
    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    max_level: number;
}