import { Injectable } from "@nestjs/common";
import { PolicyToOrganization } from "src/domains/policyToOrganization.entity";
import { DataSource, Repository } from "typeorm";



@Injectable()
export class PolicyToOrganizationRepository extends Repository<PolicyToOrganization>{
    constructor(private dataSource: DataSource){
        super(PolicyToOrganization, dataSource.createEntityManager())
    }
    
}