import { BadRequestException, Injectable} from '@nestjs/common';
import { userRole } from '../common/enums';
import { createStudentDto } from './dto/student.dto';
import { createDepartmentDto } from './dto/department.dto';
import { adminRepository } from './repositories/admin.repository';

@Injectable()
export class UserService {
    constructor(
        private adminRepo: adminRepository
    ) {}

    async uploadStudentCSV(file: Express.Multer.File, role: userRole.STUDENT) {
        return this.adminRepo.uploadStudentCSV(file, role)
    };

    async createOneStudent(dto: createStudentDto, role: userRole.STUDENT) {
        try {
            const student = await this.adminRepo.createStudent(dto, role);

            return student;
            // {message: "Student added successfully"};
        } catch (error: any) {
            throw new BadRequestException(error?.message ?? "failed to add student")
        };
    }

    async addDepartment(dto: createDepartmentDto) {
        return this.adminRepo.addDepartment(dto);
    }    
}
