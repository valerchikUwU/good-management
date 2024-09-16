import { Target } from "src/domains/target.entity";
import { User } from "src/domains/user.entity";



export class TargetHolderCreateDto{
    target: Target;
    user: User
}