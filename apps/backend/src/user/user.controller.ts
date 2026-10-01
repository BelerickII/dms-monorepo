import { BadRequestException, Body, Controller, Get, Post, Query, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { userRole } from '../common/enums';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { createStudentDto } from './dto/student.dto';
import { createDepartmentDto } from './dto/department.dto';
import { createStaffDto } from './dto/staff.dto';
import { createUserDto } from './dto/admin.dto';

@Controller('user')
export class UserController {
    constructor (private readonly userService: UserService) {}

    @Post('admin/student-csv')
    @UseInterceptors(FileInterceptor('file', {
        fileFilter: (req, file, callback) => {
            const allowMimeTypes = ['text/csv', 'application/vnd.ms-excel'];

            if(!allowMimeTypes.includes(file.mimetype)) {
                return callback( new BadRequestException('Only CSV files are allowed'), false);
            }
            callback(null, true) }})
    )
    async massEnrollStudent(@UploadedFile() file: Express.Multer.File) {
        if(!file) {throw new BadRequestException('No CSV file uploaded')};
        return this.userService.uploadStudentCSV(file, userRole.STUDENT);
    }

    @Post('admin/add-student')
    @UsePipes(ValidationPipe)
    async addOneStudent(@Body() dto: createStudentDto) {
        return this.userService.createOneStudent(dto, userRole.STUDENT);
    }

    @Post('admin/department')
    @UsePipes(ValidationPipe)
    async createDepartment(@Body() dto: createDepartmentDto) {
        return this.userService.addDepartment(dto);
    }

    @Post('admin/add-staff')
    @UsePipes(ValidationPipe)
    async addStaff(@Body() dto: createStaffDto) {
        return this.userService.createStaff(dto, userRole.STAFF);
    }

    @Post('admin/add-admin')
    @UsePipes(ValidationPipe)
    async addAdmin(@Body() dto: createUserDto) {
        return this.userService.createAdmin(dto, userRole.ADMIN);
    }

    @Get()
    async getUsers(@Query('page') page: string, @Query('limit') limit: string, @Query('role') rawRole?: string) {
        /** Did this because my service layer "role" won't accept a string value from the user
         * the db needs it to be an enum type (that's the constraint). I am casting it to that enum or union
         * type here to allow it reach the db safely without complaints. I also validated the request to be sure
         * a user can't do something like this "?role=hacker" and still hit my db (cheers)
         */
        const validRoles = ["student", "staff", "admin"];
        let roleEnum: "student" | "staff" | "admin" | undefined;

        if (rawRole && validRoles.includes(rawRole)) {
        roleEnum = rawRole as "student" | "staff" | "admin";
        } else if (rawRole) {
        throw new BadRequestException("Invalid role provided");
        }
        
        return this.userService.getUsers(+page, +limit, roleEnum);
    }
}
