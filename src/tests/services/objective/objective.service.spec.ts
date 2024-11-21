import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { WinstonModule } from "nest-winston";
import { ObjectiveService } from "src/application/services/objective/objective.service"
import { ObjectiveRepository } from "src/application/services/objective/repository/objective.repository"
import { Objective } from "src/domains/objective.entity";
import { winstonConfig } from "src/utils/winston-logger";
import { RepositoryFake } from "../FakeClasses/repositoryFake";
import { ObjectiveReadDto } from "src/contracts/objective/read-objective.dto";
import { faker } from "@faker-js/faker/.";
import { Account } from "src/domains/account.entity";
import { NotFoundException } from "@nestjs/common";

describe('ObjectiveService', () => {
    let objectiveService: ObjectiveService;
    let objectiveRepository: ObjectiveRepository;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [WinstonModule.forRoot(winstonConfig)],
            providers: [
                ObjectiveService,
                {
                    provide: getRepositoryToken(Objective),
                    useClass: RepositoryFake
                }
            ]
        }).compile();
        objectiveService = module.get(ObjectiveService);
        objectiveRepository = module.get(getRepositoryToken(Objective))
    });

    describe('find all objectives', () => {
        it('returns all objectives', async () => {

            const account: Account = {
                id: faker.string.uuid(),
                accountName: faker.company.name(),
                tenantId: faker.string.uuid(),
                createdAt: new Date(),
                updatedAt: new Date(),
                users: null,
                organizations: null,
                goals: null,
                objectives: null,
                policies: null,
                projects: null,
                strategies: null,
                posts: null,
                statistics: null,
                roleSettings: null,
                policyDirectories: null,
                converts: null,
                groups: null,
              };
              
            const objectives: ObjectiveReadDto[] = [
                {
                    id: faker.string.uuid(),
                    situation: faker.helpers.multiple(() => faker.animal.cat(), {
                        count: 3,
                      }),
                    content: faker.helpers.multiple(() => faker.animal.cat(), {
                        count: 3,
                      }),
                    rootCause: faker.helpers.multiple(() => faker.animal.cat(), {
                        count: 3,
                      }),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    strategy: {} as any,
                    account: account,
                },
                {
                    id: faker.string.uuid(),
                    situation: faker.helpers.multiple(() => faker.animal.cat(), {
                        count: 3,
                      }),
                    content: faker.helpers.multiple(() => faker.animal.cat(), {
                        count: 3,
                      }),
                    rootCause: faker.helpers.multiple(() => faker.animal.cat(), {
                        count: 3,
                      }),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    strategy: {} as any,
                    account: account,
                },
                {
                    id: faker.string.uuid(),
                    situation: faker.helpers.multiple(() => faker.animal.cat(), {
                        count: 3,
                      }),
                    content: faker.helpers.multiple(() => faker.animal.cat(), {
                        count: 3,
                      }),
                    rootCause: faker.helpers.multiple(() => faker.animal.cat(), {
                        count: 3,
                      }),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    strategy: {} as any,
                    account: {} as any,
                },
            ]

            const objectiveRepositoryFindAllSpy = jest.spyOn(objectiveRepository, 'find').mockResolvedValue(objectives);

            const result = await objectiveService.findAllForAccount(account);
            expect(result).toMatchObject(objectives);      
            expect(objectiveRepositoryFindAllSpy).toHaveBeenCalledWith({
                where: { account: { id: account.id } },
                relations: []
              });
        });
    });

    describe('finding one objective', () => {
        it('throws an error when an objective doesnt exist', async () => {
            const objectiveId = faker.string.uuid();
      
            const objectiveRepositoryFindOneSpy = jest
              .spyOn(objectiveRepository, 'findOne')
              .mockResolvedValue(null);
      
            expect.assertions(3);
      
            try {
              await objectiveService.findOneById(objectiveId);
            } catch (e) {
              expect(e).toBeInstanceOf(NotFoundException);
              expect(e.message).toBe(`Краткосрочная цель с ID: ${objectiveId} не найдена`);
            }
      
            expect(objectiveRepositoryFindOneSpy).toHaveBeenCalledWith({
              where: { id: objectiveId },
              relations: ['strategy'],
            });
          });

          it('returns the found objective', async () => {
            const objectiveId = faker.string.uuid();
      
            const existingObjective: ObjectiveReadDto = {
                id: objectiveId,
                situation: faker.helpers.multiple(() => faker.animal.cat(), {
                    count: 3,
                  }),
                content: faker.helpers.multiple(() => faker.animal.cat(), {
                    count: 3,
                  }),
                rootCause: faker.helpers.multiple(() => faker.animal.cat(), {
                    count: 3,
                  }),
                createdAt: new Date(),
                updatedAt: new Date(),
                strategy: {} as any,
                account: {} as any,
            };
      
            const objectiveRepositoryFindOneSpy = jest
              .spyOn(objectiveRepository, 'findOne')
              .mockResolvedValue(existingObjective);
      
            const result = await objectiveService.findOneById(objectiveId);
            expect(result).toMatchObject(existingObjective);
            expect(objectiveRepositoryFindOneSpy).toHaveBeenCalledWith({
                where: { id: objectiveId },
                relations: ['strategy'],
            });
          });
      
    });
});