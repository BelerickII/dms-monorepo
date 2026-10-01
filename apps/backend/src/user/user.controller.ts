import { BadRequestException, Body, Controller, Post, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
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
}
