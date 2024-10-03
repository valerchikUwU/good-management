import { Roles } from 'src/domains/role.entity';
import { RoleSetting } from 'src/domains/roleSetting.entity';
import { User } from 'src/domains/user.entity';

export class RoleReadDto {
    id: string;
    roleName: Roles;
    createdAt: Date;
    updatedAt: Date;
    roleSettings: RoleSetting[]
    users: User[]
}