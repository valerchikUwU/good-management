import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { GoalService } from 'src/application/services/goal/goal.service';
import { GoalRepository } from 'src/application/services/goal/repository/goal.repository';
import { Goal } from 'src/domains/goal.entity';
import { winstonConfig } from 'src/utils/winston-logger';
import { RepositoryFake } from '../account/FakeClasses/account-repositoryFake';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { faker } from '@faker-js/faker/.';
import { GoalCreateDto } from 'src/contracts/goal/create-goal.dto';
import { ReportDay } from 'src/domains/organization.entity';
import { GoalReadDto } from 'src/contracts/goal/read-goal.dto';

describe('GoalService', () => {
    let goalService: GoalService;
    let goalRepository: GoalRepository;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [WinstonModule.forRoot(winstonConfig)],
            providers: [
                GoalService,
                {
                    provide: getRepositoryToken(Goal),
                    useClass: RepositoryFake,
                },
            ],
        }).compile();
        goalService = module.get(GoalService);
        goalRepository = module.get(getRepositoryToken(Goal));
    });

    describe('creating a goal', () => {
        it('throws a validation error when organizationId is not provided', async () => {
            expect.assertions(2);
            try {
                await goalService.create({
                    content: ['1', '2'],
                    organizationId: '',
                    user: null,
                    account: null,
                    organization: null,
                });
            } catch (err) {
                expect(err).toBeInstanceOf(BadRequestException);
                expect(err.message).toBe('Выберите организацию!');
            }
        });

        it('throws a validation error when content is not provided', async () => {
            expect.assertions(2);
            try {
                await goalService.create({
                    content: [],
                    organizationId: faker.string.uuid(),
                    user: null,
                    account: null,
                    organization: null,
                });
            } catch (err) {
                expect(err).toBeInstanceOf(BadRequestException);
                expect(err.message).toBe('Содержание не может быть пустым!');
            }
        });

        it('calls the repository with correct paramaters', async () => {
            const content = faker.helpers.multiple(() => faker.animal.cat(), {
                count: 3,
            });
            const organizationId = faker.string.uuid();

            const goalCreateDto: GoalCreateDto = {
                content: content,
                organizationId: organizationId,
                user: null,
                account: null,
                organization: null,
            };

            const savedGoal: Goal = {
                id: faker.string.uuid(),
                content: content,
                createdAt: new Date(),
                updatedAt: new Date(),
                user: null,
                account: null,
                organization: null,
            };

            const goalRepositoryInsertSpy = jest
                .spyOn(goalRepository, 'insert')
                .mockResolvedValue({
                    identifiers: [{ id: savedGoal.id }],
                    generatedMaps: [],
                    raw: [],
                });

            const result = await goalService.create(goalCreateDto);

            expect(goalRepositoryInsertSpy).toBeCalledWith(
                expect.objectContaining({
                    content: goalCreateDto.content,
                }),
            );
            expect(result).toEqual(savedGoal.id);
        });
    });

    describe('finding a goal', () => {
        it('throws an error when a goal doesnt exist', async () => {
            const goalId = faker.string.uuid();

            const goalRepositoryFindOneSpy = jest
                .spyOn(goalRepository, 'findOne')
                .mockResolvedValue(null);

            expect.assertions(3);

            try {
                await goalService.findOneById(goalId, ['organization']);
            } catch (e) {
                expect(e).toBeInstanceOf(NotFoundException);
                expect(e.message).toBe(`Цель с ID: ${goalId} не найдена!`);
            }

            expect(goalRepositoryFindOneSpy).toHaveBeenCalledWith({
                where: { id: goalId },
                relations: ['organization'],
            });
        });

        it('returns the found goal', async () => {
            const goalId = faker.string.uuid();

            const existingGoal: GoalReadDto = {
                id: goalId,
                content: faker.helpers.multiple(() => faker.animal.cat(), {
                    count: 3,
                }),
                createdAt: new Date(),
                updatedAt: new Date(),
                organization: {
                    id: faker.string.uuid(),
                    organizationName: faker.company.name(),
                    parentOrganizationId: null,
                    reportDay: ReportDay.FRIDAY,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    goal: null,
                    users: null,
                    posts: null,
                    policyToOrganizations: null,
                    projects: null,
                    strategies: null,
                    account: null,
                },
            };


            const goalRepositoryFindOneSpy = jest
                .spyOn(goalRepository, 'findOne')
                .mockResolvedValue(existingGoal as Goal);

            const result = await goalService.findOneById(goalId, ['organization']);
            expect(result).toMatchObject<GoalReadDto>(existingGoal);
            expect(goalRepositoryFindOneSpy).toHaveBeenCalledWith({
                where: { id: goalId },
                relations: ['organization']
            });
        });
    })
});
