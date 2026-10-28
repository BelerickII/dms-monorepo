import { IsEnum, IsOptional, IsString } from "class-validator";
import { mailStatus, mailType } from "../../../common/enums";
import { paginationDto } from "../../../common/pagination.dto";

export class emailJobQueueDto extends paginationDto {
    @IsOptional()
    @IsEnum(mailStatus)
    status: mailStatus;

    @IsOptional()
    @IsEnum(mailType)
    mailkind: mailType;

    @IsOptional()
    @IsString()
    search: string;
}