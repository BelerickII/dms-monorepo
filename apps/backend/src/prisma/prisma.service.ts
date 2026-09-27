import { Injectable } from "@nestjs/common";
import { db } from "./db";


@Injectable()
export class PrismaService {
    //Expose the plain client object so it can be used cleanly throughout NestJS
    client = db;
}