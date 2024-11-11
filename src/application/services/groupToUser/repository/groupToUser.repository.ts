import { Injectable } from '@nestjs/common';
import { GroupToUser } from 'src/domains/groupToUser.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class GroupToUserRepository extends Repository<GroupToUser> {
  constructor(private dataSource: DataSource) {
    super(GroupToUser, dataSource.createEntityManager());
  }
}
