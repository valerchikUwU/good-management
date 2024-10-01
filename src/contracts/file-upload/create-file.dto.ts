import { Policy } from 'src/domains/policy.entity';


export class FileCreateDto{
    fileName: string;
    path: string;
    size: number;
    mimetype: string;
    policy: Policy
}