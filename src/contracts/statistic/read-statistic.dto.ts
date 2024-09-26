import { Account } from "src/domains/account.entity";
import { Post } from "src/domains/post.entity";
import { Type } from "src/domains/statistic.entity";
import { StatisticData } from "src/domains/statisticData.entity";


export class StatisticReadDto{
    id: string;
    type: Type;
    name: string;
    description: string
    createdAt: Date;
    updatedAt: Date;
    statisticDatas: StatisticData[];
    post: Post;
    account: Account
}