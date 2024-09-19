import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Target } from "src/domains/target.entity";
import { TargetService } from "../services/target/target.service";
import { TargetRepository } from "../services/target/repository/target.repository";
import { TargetController } from "src/controllers/target.controller";
import { TargetHolderModule } from "./targetHolder.module";
import { UsersModule } from "./users.module";


@Module({
    imports: [TypeOrmModule.forFeature([Target]), TargetHolderModule, UsersModule],
    controllers: [TargetController],
    providers: [TargetService, TargetRepository],
    exports: [TargetService]
})
export class TargetModule{}