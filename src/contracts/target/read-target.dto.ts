import { Project } from 'src/domains/project.entity';
import { State, Type } from 'src/domains/target.entity';
import { TargetHolder } from 'src/domains/targetHolder.entity';

export class TargetReadDto {
  id: string;
  type: Type;
  orderNumber: number;
  content: string;
  holderPostId: string;
  targetState: State;
  dateStart: Date;
  deadline: Date;
  dateComplete: Date;
  createdAt: Date;
  updatedAt: Date;
  targetHolders: TargetHolder[];
  project: Project;
}
