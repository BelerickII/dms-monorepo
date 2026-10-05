import { BadRequestException, Injectable} from '@nestjs/common';
import { userRole } from '../common/enums';
import { createStudentDto } from './dto/student.dto';
import { createDepartmentDto } from './dto/department.dto';
import { adminRepository } from './repositories/admin.repository';
import { createStaffDto } from './dto/staff.dto';
import { createUserDto } from './dto/admin.dto';

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
        try {
            const department = await this.adminRepo.addDepartment(dto);            

            return department; 
            //{message: 'Department added successfully' };
        } catch (error: any) {
            throw new BadRequestException(error?.message ?? 'failed to add department')
        }
    }
    
    async createStaff(dto: createStaffDto, role: userRole.STAFF) {
       try {
        const staff = await this.adminRepo.createStaff(dto, role);

        return staff;
        // {message: "Staff added successfully"};
       } catch (error: any) {
        throw new BadRequestException(error?.message ?? "failed to add staff")
       }
    }

    async createAdmin(dto: createUserDto, role: userRole.ADMIN) {
        try {
            const admin = await this.adminRepo.createUser(dto, role);

            return admin;
            // {message: "Admin added successfully"};
        } catch (error: any) {
            throw new BadRequestException(error?.message ?? "failed to add admin")
        }
    }

    async getUsers(page: number, limit: number, roleEnum: any) {
        return await this.adminRepo.getAllUsers(page, limit, roleEnum);
    }

    async getUserById(id: number) {
        return await this.adminRepo.getUserWithDetails(id);
    }

    async searchUsers(searchTerm: string) {
        return await this.adminRepo.findUsers(searchTerm);
    }
}
