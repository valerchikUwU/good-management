import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Policy } from "src/domains/policy.entity";
import { PolicyService } from "../services/policy/policy.service";
import { PolicyRepository } from "../services/policy/repository/policy.repository";
import { PolicyController } from "src/controllers/policy.controller";
import { UsersModule } from "./users.module";


@Module({
    imports: [TypeOrmModule.forFeature([Policy]),
    UsersModule],
    controllers: [PolicyController],
    providers: [PolicyService, PolicyRepository]
})
export class PolicyModule{}