import { Injectable } from "@nestjs/common";
import { ProjectToOrganization } from "src/domains/projectToOrganization.entity";
import { DataSource, Repository } from "typeorm";



@Injectable()
export class ProjectToOrganizationRepository extends Repository<ProjectToOrganization>{
    constructor(private dataSource: DataSource){
        super(ProjectToOrganization, dataSource.createEntityManager())
    }
    
}