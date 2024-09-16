import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Target } from "src/domains/target.entity";
import { TargetService } from "../services/target/target.service";
import { TargetRepository } from "../services/target/repository/target.repository";
import { TargetController } from "src/controllers/target.controller";


@Module({
    imports: [TypeOrmModule.forFeature([Target])],
    controllers: [TargetController],
    providers: [TargetService, TargetRepository]
})
export class TargetModule{}