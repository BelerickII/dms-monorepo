import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";

import { userRole } from "../../common/enums";
import { createUserDto } from "../dto/admin.dto";
import { createStudentDto } from "../dto/student.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { createDepartmentDto } from "../dto/department.dto";

import { Readable } from "stream";
import csvParser from "csv-parser";
import * as bcrypt from 'bcrypt';
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { createStaffDto } from "../dto/staff.dto";


@Injectable()
export class adminRepository {
    constructor(private readonly prisma: PrismaService) {}

    //Logic to create students in bulk using a CSV
    async uploadStudentCSV(file: Express.Multer.File, role: userRole) {
        //uploaded file is streamed from memory and stored in stream
        const stream = Readable.from(file.buffer);

        //initializing the parser to convert the stream CSV into a JS object
        const parser = csvParser();

        //Array to log successful & failed uploads per row and the type is specifying the array is receiving JS objects
        const successfulImports: Array<{ row: number }> = [];
        const failedImports: Array<{row: number; error: string}> = [];

        let rowNumber = 1;

        //for each row in the CSV do this
        for await (const rawRow of stream.pipe(parser)) {
            const currentRow = rowNumber++;

            try {
                //convert CSV values into a CreateStudentDto instance
                const dto = plainToInstance(createStudentDto, rawRow);

                //call the validation method
                await this.validateDtoStudent(dto, currentRow);

                //call the method that saves the student in DB
                await this.createStudent(dto, role);

                successfulImports.push({
                    row: currentRow
                });
            } catch (error: any) {
                failedImports.push({
                    row: currentRow,
                    error: error?.message ?? "Unkown error during import",
                });
            };
        };

        //Import summary
        return { 
            total: successfulImports.length + failedImports.length,
            successCount: successfulImports.length,
            errorCount: failedImports.length,
            failedImports,
        };        
    }


    //validate each row from the CSV (now a JS object) matches the expected input specified in the DTO
    private async validateDtoStudent(dto: createStudentDto, rowNumber: number): Promise<void> {
        const validationErrors = await validate(dto);
        
        if (validationErrors.length > 0) {
            const messages = validationErrors.flatMap((ve) => Object.values(ve.constraints ?? {})
            .map((message) => `${ve.property}: ${message}`))
            .join('; ');
            throw new BadRequestException(`Row ${rowNumber} validation failed: ${messages}`);
        };
    }


    //Method to handle the creation of a user (admin)
    async createUser(dto: createUserDto, role: userRole, tx: any = this.prisma.client) {
        const lemail = dto.email.toLowerCase();

        //checking for existing user by email
        const existing = await tx.orm.public.User.where({ email: lemail }).first();

        if(existing) { throw new BadRequestException(`User with email "${lemail}" already exists`)};

        //Determine initial password
        const plainPassword = dto.password;
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        const user = await tx.orm.public.User.create({           
            email: lemail,
            firstName: dto.firstName,
            lastName: dto.lastName,
            role: role,
            password: hashedPassword,
            mustResetPassword: true,
            isActive: true            
        });

        return user;
        
    }


    //Method to handle the creation of a student
    async createStudent(dto: createStudentDto, role: userRole) {
        //creation of User + Student data on DB must succeed/fail together (Atomicity)
        return await this.prisma.client.transaction(async (tx) => {
            const user = await this.createUser(dto, role, tx);

            //Prevent duplicate matric number even tho their constraint for that on the DB already
            //This is to prevent the server errors (500's)
            const existing = await tx.orm.public.Student.where({ matric_no: dto.matric_no }).first();
            if(existing) { throw new BadRequestException(`Student with matric number "${dto.matric_no}" already exists`)}

            //Determines the department the student belongs to exist and map the ID to the student table as foreign key
            const dept = await tx.orm.public.Department.where({ department: dto.department }).first();
            if(!dept) { throw new NotFoundException('Department not found')};

            return await tx.orm.public.Student.create({
                matric_no: dto.matric_no,
                department: dto.department,
                mode_of_entry: dto.mode_of_entry,
                level: dto.level,
                graduated: false,
                userId: user.id,
                departmentId: dept.id
            });
        });        
    }

    //Method to handle the creation of a Staff
    async createStaff(dto: createStaffDto, role: userRole) {
        return await this.prisma.client.transaction( async (tx) => {
            const user = await this.createUser(dto, role, tx);
            
            const existing = await tx.orm.public.Staff.where({ staffId: dto.staffID }).first();
            if(existing) { throw new BadRequestException(`Staff with this ID number "${dto.staffID}" already exists`)};

            return await tx.orm.public.Staff.create({
                staffId: dto.staffID,
                userId: user.id
            });
        });
    }

    
    //Method to handle the addition of a Department to the DB
    async addDepartment(dto: createDepartmentDto) {
        try {
            const existing = await this.prisma.client.orm.public.Department.where({ department: dto.department }).first();
            if(existing) { throw new BadRequestException(`${dto.department} already exists`) };

            const department = this.prisma.client.orm.public.Department.create({
                department: dto.department,
                max_level: dto.max_level
            });

            return department; 
            //{message: 'Department added successfully' };
        } catch (error: any) {
            throw new BadRequestException(error?.message ?? 'failed to add department')
        }
    }
}