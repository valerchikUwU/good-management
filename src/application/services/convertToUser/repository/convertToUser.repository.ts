import { Injectable } from "@nestjs/common";
import { ConvertToUser } from "src/domains/convertToUser.entity";
import { DataSource, Repository } from "typeorm";



@Injectable()
export class ConvertToUserRepository extends Repository<ConvertToUser>{
    constructor(private dataSource: DataSource){
        super(ConvertToUser, dataSource.createEntityManager())
    }
    
}