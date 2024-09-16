import { Injectable } from "@nestjs/common";
import { ObjectiveToOrganization } from "src/domains/objectiveToOrganization.entity";
import { DataSource, Repository } from "typeorm";



@Injectable()
export class ObjectiveToOrganizationRepository extends Repository<ObjectiveToOrganization>{
    constructor(private dataSource: DataSource){
        super(ObjectiveToOrganization, dataSource.createEntityManager());
    }
}