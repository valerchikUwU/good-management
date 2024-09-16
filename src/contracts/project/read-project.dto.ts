import { Type } from "src/domains/project.entity";
import { ProjectToOrganization } from "src/domains/projectToOrganization.entity";
import { Target } from "src/domains/target.entity";

export class ProjectReadDto{
    id: string;
    programId: string;
    content: string;
    type: Type;
    projectToOrganizations: ProjectToOrganization[]
    targets: Target[]
}