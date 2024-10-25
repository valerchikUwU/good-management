import { Account } from "src/domains/account.entity";
import { Type } from "src/domains/project.entity";
import { Strategy } from "src/domains/strategy.entity";
import { User } from "src/domains/user.entity";
import { TargetCreateDto } from "../target/create-target.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { TargetCreateEventDto } from "../target/createEvent-target.dto";

export class ProjectCreateEventDto {
    eventType: string;
    id: string;
    programId: string | null;
    content: string | null;
    type: string; //default project
    projectToOrganizations: string[];
    createdAt: Date;
    strategyId: string | null;
    accountId: string;
    userId: string;
    targetCreateDtos: TargetCreateEventDto[] | null; //nullable
}


// не может быть активным пока нет 1 задачи "продукт" и 1 задачи "обычная"