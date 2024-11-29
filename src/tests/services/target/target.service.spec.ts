import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from 'src/utils/winston-logger';
import { RepositoryFake } from '../FakeClasses/repositoryFake';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { faker } from '@faker-js/faker/.';
import { StrategyService } from 'src/application/services/strategy/strategy.service';
import { Strategy } from 'src/domains/strategy.entity';
import { StrategyReadDto } from 'src/contracts/strategy/read-strategy.dto';
import { FindOptionsWhere, In, IsNull, Not } from 'typeorm';
import { Organization, ReportDay } from 'src/domains/organization.entity';
import { StrategyCreateDto } from 'src/contracts/strategy/create-strategy.dto';
import { StrategyUpdateDto } from 'src/contracts/strategy/update-strategy.dto';
import { Target, Type, State } from 'src/domains/target.entity';
import { TargetService } from 'src/application/services/target/target.service';
import { TargetRepository } from 'src/application/services/target/repository/target.repository';
import { TargetReadDto } from 'src/contracts/target/read-target.dto';
import { Project, Type as ProjectType } from 'src/domains/project.entity';
import { TargetCreateDto } from 'src/contracts/target/create-target.dto';
import { TargetUpdateDto } from 'src/contracts/target/update-target.dto';

describe('GoalService', () => {
    let targetService: TargetService;
    let targetRepository: TargetRepository;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [WinstonModule.forRoot(winstonConfig)],
            providers: [
                StrategyService,
                {
                    provide: getRepositoryToken(Target),
                    useClass: RepositoryFake,
                },
            ],
        }).compile();
        targetService = module.get(TargetService);
        targetRepository = module.get(getRepositoryToken(Target));
    });


    describe('finding all targets', () => {


        it('returns all targets', async () => {


            const existingTargets: TargetReadDto[] = [
                {
                    id: faker.string.uuid(),
                    type: Type.COMMON,
                    orderNumber: faker.number.int(),
                    content: faker.finance.transactionDescription(),
                    holderUserId: faker.string.uuid(),
                    targetState: State.ACTIVE,
                    dateStart: faker.date.anytime(),
                    deadline: faker.date.anytime(),
                    dateComplete: null,
                    createdAt: faker.date.anytime(),
                    updatedAt: faker.date.anytime(),
                    targetHolders: {} as any,
                    project: {} as any,
                },
                {
                    id: faker.string.uuid(),
                    type: Type.COMMON,
                    orderNumber: faker.number.int(),
                    content: faker.finance.transactionDescription(),
                    holderUserId: faker.string.uuid(),
                    targetState: State.ACTIVE,
                    dateStart: faker.date.anytime(),
                    deadline: faker.date.anytime(),
                    dateComplete: null,
                    createdAt: faker.date.anytime(),
                    updatedAt: faker.date.anytime(),
                    targetHolders: {} as any,
                    project: {} as any,
                },
                {
                    id: faker.string.uuid(),
                    type: Type.COMMON,
                    orderNumber: faker.number.int(),
                    content: faker.finance.transactionDescription(),
                    holderUserId: faker.string.uuid(),
                    targetState: State.ACTIVE,
                    dateStart: faker.date.anytime(),
                    deadline: faker.date.anytime(),
                    dateComplete: null,
                    createdAt: faker.date.anytime(),
                    updatedAt: faker.date.anytime(),
                    targetHolders: {} as any,
                    project: {} as any,
                }
            ]


            const targetRepositoryFindAllSpy = jest
                .spyOn(targetRepository, 'find')
                .mockResolvedValue(existingTargets);

            const result = await targetService.findAll();
            expect(result).toMatchObject(existingTargets);
            expect(targetRepositoryFindAllSpy).toHaveBeenCalled()
        });


    describe('creating a target', () => {

        it('calls the repository with correct paramaters', async () => {

            const project: Project =         {
                id: faker.string.uuid(),
                projectNumber: faker.number.int(),
                projectName: faker.book.title(),
                programId: faker.string.uuid(),
                content: faker.string.sample(),
                type: ProjectType.PROJECT,
                createdAt: new Date(),
                updatedAt: new Date(),
                organization: {} as any,
                targets: {} as any,
                strategy: {} as any,
                account: {} as any,
                user: {} as any,
              },

   
              const type = Type.COMMON;
              const orderNumber = faker.number.int();
              const content = faker.finance.transactionDescription();
              const holderUserId = faker.string.uuid();
              const targetState = State.ACTIVE;
              const dateStart = faker.date.anytime();
              const deadline = faker.date.anytime();

            const savedTarget: Target = {
                id: faker.string.uuid(),
                type: type,
                orderNumber: orderNumber,
                content: content,
                holderUserId: holderUserId,
                targetState: targetState,
                dateStart: dateStart,
                deadline: deadline,
                dateComplete: null,
                createdAt: faker.date.anytime(),
                updatedAt: faker.date.anytime(),
                targetHolders: {} as any,
                project: project,
            };

            const targetCreateDto: TargetCreateDto = {
                type: type,
                orderNumber: orderNumber,
                content: content,
                holderUserId: holderUserId,
                dateStart: dateStart,
                deadline: deadline,
                project: project,
                holderUser: {} as any
            }


            const targetRepositoryInsertSpy = jest
                .spyOn(targetRepository, 'insert')
                .mockResolvedValue({
                    identifiers: [{ id: savedTarget.id }],
                    generatedMaps: [],
                    raw: [],
                });

            const result = await targetService.create(targetCreateDto);

            expect(targetRepositoryInsertSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: type,
                    orderNumber: orderNumber,
                    content: faker.finance.transactionDescription(),
                    dateStart: dateStart,
                    deadline: deadline,
                    project: project,
                    holderUser: {} as any
                }),);
            expect(result).toMatch(savedTarget.id);
        });
    });


    describe('updating a target', () => {
        it('throws an error when a target doesnt exist', async () => {

            const targetId = faker.string.uuid()
            const updateTargetDto: TargetUpdateDto = {
                  _id: targetId,
                  content: faker.finance.transactionDescription(),
                  orderNumber: faker.number.int(),
                  holderUserId: faker.string.uuid(),
                  targetState: State.ACTIVE,
                  type: Type.COMMON,
                  dateStart: faker.date.anytime(),
                  deadline: faker.date.anytime(),
                  holderUser: {} as any
            }

            const targetRepositoryFindOneSpy = jest
                .spyOn(targetRepository, 'findOne')
                .mockResolvedValue(null);

            expect.assertions(3);

            try {
                await targetService.update(updateTargetDto);
            } catch (e) {
                expect(e).toBeInstanceOf(NotFoundException);
                expect(e.message).toBe(`Задача с ID ${targetId} не найдена`);
            }
            expect(targetRepositoryFindOneSpy).toHaveBeenCalledWith({
                where: { id: targetId },
            });
        });

        it('returns the updated targetId', async () => {
            const targetId = faker.string.uuid();


            const updateStrategyDto: StrategyUpdateDto = {
                _id: targetId,
                content: faker.finance.transactionDescription(),
                orderNumber: faker.number.int(),
                holderUserId: faker.string.uuid(),
                targetState: State.ACTIVE,
                type: Type.COMMON,
                dateStart: faker.date.anytime(),
                deadline: faker.date.anytime(),
                holderUser: {} as any
            }

            const existingStrategy: StrategyReadDto = {
                id: strategyId,
                strategyNumber: faker.number.int(),
                dateActive: null,
                content: faker.finance.accountName(),
                state: State.DRAFT,
                createdAt: new Date(),
                updatedAt: new Date(),
                user: {} as any,
                account: {} as any,
                organization: organization,
                objective: {} as any,
                projects: {} as any,
            };

            const strategyRepositoryFindOneMock = jest.spyOn(strategyRepository, 'findOne').mockImplementation(({ where }) => {
                const whereObj = where as FindOptionsWhere<Strategy>; // Приводим к объекту
              
                if (
                  typeof whereObj.organization === 'object' && 
                  'id' in whereObj.organization &&
                  whereObj.organization.id === organization.id
                ) {
                  return Promise.resolve(null); // Стратегия со статусом ACTIVE не найдена
                }
              
                if (whereObj.id === strategyId) {
                  return Promise.resolve(existingStrategy); // Возвращаем стратегию по ID
                }
              
                return Promise.resolve(null); // По умолчанию
              });
            const strategyRepositoryUpdateSpy = jest
                .spyOn(strategyRepository, 'update')
                .mockResolvedValue({
                    generatedMaps: [],
                    raw: [],
                    affected: 1
                });

            const result = await strategyService.update(strategyId, updateStrategyDto);
            expect(result).toMatch(existingStrategy.id);
            expect(strategyRepositoryFindOneMock).toHaveBeenCalledWith({
                where: { id: strategyId },
                relations: ['organization'],
            });
            expect(strategyRepositoryFindOneMock).toHaveBeenCalledWith({
                where: {
                    state: State.ACTIVE,
                    organization: { id: organization.id },
                },
            });
            expect(strategyRepositoryUpdateSpy).toHaveBeenCalledWith(
                strategyId,
                expect.objectContaining({
                    state: updateStrategyDto.state,
                    content: updateStrategyDto.content,
                }));
        });
    });
});
