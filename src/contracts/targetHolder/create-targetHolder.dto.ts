import { Exclude } from "class-transformer";
import { Target } from "src/domains/target.entity";
import { User } from "src/domains/user.entity";



export class TargetHolderCreateDto{
    
    @Exclude({toPlainOnly: true})
    target: Target;

    @Exclude({toPlainOnly: true})
    user: User
}