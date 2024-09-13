import { Injectable } from "@nestjs/common";
import { GoalToOrganization } from "src/domains/goalToOrganization.entity";
import { DataSource, Repository } from "typeorm";



@Injectable()
export class GoalToOrganizationRepository extends Repository<GoalToOrganization>{
    constructor(private dataSource: DataSource){
        super(GoalToOrganization, dataSource.createEntityManager())
    }
    
}