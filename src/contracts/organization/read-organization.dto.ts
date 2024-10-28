import { ApiProperty } from "@nestjs/swagger";
import { Account } from "src/domains/account.entity";
import { Goal } from "src/domains/goal.entity";
import { PolicyToOrganization } from "src/domains/policyToOrganization.entity";
import { Post } from "src/domains/post.entity";
import { Project } from "src/domains/project.entity";
import { Strategy } from "src/domains/strategy.entity";
import { User } from "src/domains/user.entity";



export class OrganizationReadDto {
    
    @ApiProperty({ description: 'ID организации' })
    id: string;
    
    @ApiProperty({ description: 'Название организации' })
    organizationName: string;
    
    @ApiProperty({ description: 'ID родительской организации' })
    parentOrganizationId: string
    
    @ApiProperty({ description: 'Дата создания' })
    createdAt: Date;
    
    @ApiProperty({ description: 'Дата обновления' })
    updatedAt: Date;
    
    @ApiProperty({ description: 'Список ID пользователей, принадлежащих организации', isArray: true  })
    users: User[];
    
    @ApiProperty({ description: 'Список ID постов, принадлежащих организации', isArray: true  })
    posts: Post[];
    
    @ApiProperty({ description: 'ID цели, принадлежащей организации' })
    goal: Goal;
    
    @ApiProperty({ description: 'Список ID политик, принадлежащих организации', isArray: true  })
    policyToOrganizations: PolicyToOrganization[]
    
    @ApiProperty({ description: 'Список ID проектов, принадлежащих организации', isArray: true  })
    projects: Project[]
    
    @ApiProperty({ description: 'Список ID стратегий, принадлежащих организации', isArray: true  })
    strategies: Strategy[]
    
    @ApiProperty({ description: 'ID связанного аккаунта' })
    account: Account;
}