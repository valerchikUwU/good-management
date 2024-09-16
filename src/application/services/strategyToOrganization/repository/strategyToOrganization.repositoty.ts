import { Injectable } from "@nestjs/common";
import { StrategyToOrganization } from "src/domains/strategyToOrganization.entity";
import { DataSource, Repository } from "typeorm";



@Injectable()
export class StrategyToOrganizationRepository extends Repository<StrategyToOrganization>{
    constructor(private dataSource: DataSource){
        super(StrategyToOrganization, dataSource.createEntityManager())
    }
    
}