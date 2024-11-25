import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { WinstonModule } from "nest-winston";
import { winstonConfig } from "src/utils/winston-logger";
import { RepositoryFake } from "../FakeClasses/repositoryFake";
import { faker } from "@faker-js/faker/.";
import { Account } from "src/domains/account.entity";
import { NotFoundException } from "@nestjs/common";
import { State, Policy, Type } from "src/domains/policy.entity";
import { PolicyReadDto } from "src/contracts/policy/read-policy.dto";
import { PolicyService } from "src/application/services/policy/policy.service";
import { PolicyRepository } from "src/application/services/policy/repository/policy.repository";
import { Organization, ReportDay } from "src/domains/organization.entity";
import { PolicyCreateDto } from "src/contracts/policy/create-policy.dto";
import { PolicyUpdateDto } from "src/contracts/policy/update-policy.dto";
import { PolicyToPolicyDirectoryService } from "src/application/services/policyToPolicyDirectories/policyToPolicyDirectory.service";
import { PolicyDirectoryRepository } from "src/application/services/policyDirectory/repository/policyDirectory.repository";
import { PolicyDirectoryService } from "src/application/services/policyDirectory/policyDirectory.service";
import { PolicyDirectory } from "src/domains/policyDirectory.entity";
import { PolicyDirectoryReadDto } from "src/contracts/policyDirectory/read-policyDirectory.dto";
import { PolicyDirectoryCreateDto } from "src/contracts/policyDirectory/create-policyDirectory.dto";

describe('PolicyDirectoryService', () => {
    let policyDirectoryService: PolicyDirectoryService;
    let policyToPolicyDirectoryService: PolicyToPolicyDirectoryService;
    let policyDirectoryRepository: PolicyDirectoryRepository;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [WinstonModule.forRoot(winstonConfig)],
            providers: [
                PolicyDirectoryService,
                PolicyToPolicyDirectoryService,
                {
                    provide: getRepositoryToken(PolicyDirectory),
                    useClass: RepositoryFake
                }
            ]
        }).compile();
        policyDirectoryService = module.get(PolicyService);
        policyToPolicyDirectoryService = module.get(PolicyToPolicyDirectoryService)
        policyDirectoryRepository = module.get(getRepositoryToken(PolicyDirectory))
    });

    describe('find all policyDirectories', () => {
        it('returns all policyDirectories', async () => {

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

            const policyDirectories: PolicyDirectoryReadDto[] = [
                {
                    id: faker.string.uuid(),
                    directoryName: faker.book.title(),
                    policyToPolicyDirectories: [
                        {
                            id: faker.string.uuid(),
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            policy: {
                                id: faker.string.uuid(),
                                policyName: faker.book.title(),
                                policyNumber: faker.number.int(),
                                state: State.ACTIVE,
                                type: Type.DIRECTIVE,
                                dateActive: faker.date.anytime(),
                                content: faker.book.genre(),
                                createdAt: new Date(),
                                updatedAt: new Date(),
                                posts: {} as any,
                                organization: {} as any,
                                user: {} as any,
                                account: account,
                                files: {} as any,
                                policyToPolicyDirectories: {} as any,
                            },
                            policyDirectory: {} as any
                        },
                        {
                            id: faker.string.uuid(),
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            policy: {
                                id: faker.string.uuid(),
                                policyName: faker.book.title(),
                                policyNumber: faker.number.int(),
                                state: State.ACTIVE,
                                type: Type.DIRECTIVE,
                                dateActive: faker.date.anytime(),
                                content: faker.book.genre(),
                                createdAt: new Date(),
                                updatedAt: new Date(),
                                posts: {} as any,
                                organization: {} as any,
                                user: {} as any,
                                account: account,
                                files: {} as any,
                                policyToPolicyDirectories: {} as any,
                            },
                            policyDirectory: {} as any
                        }
                    ],
                }, {
                    id: faker.string.uuid(),
                    directoryName: faker.book.title(),
                    policyToPolicyDirectories: [
                        {
                            id: faker.string.uuid(),
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            policy: {
                                id: faker.string.uuid(),
                                policyName: faker.book.title(),
                                policyNumber: faker.number.int(),
                                state: State.ACTIVE,
                                type: Type.DIRECTIVE,
                                dateActive: faker.date.anytime(),
                                content: faker.book.genre(),
                                createdAt: new Date(),
                                updatedAt: new Date(),
                                posts: {} as any,
                                organization: {} as any,
                                user: {} as any,
                                account: account,
                                files: {} as any,
                                policyToPolicyDirectories: {} as any,
                            },
                            policyDirectory: {} as any
                        },
                        {
                            id: faker.string.uuid(),
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            policy: {
                                id: faker.string.uuid(),
                                policyName: faker.book.title(),
                                policyNumber: faker.number.int(),
                                state: State.ACTIVE,
                                type: Type.DIRECTIVE,
                                dateActive: faker.date.anytime(),
                                content: faker.book.genre(),
                                createdAt: new Date(),
                                updatedAt: new Date(),
                                posts: {} as any,
                                organization: {} as any,
                                user: {} as any,
                                account: account,
                                files: {} as any,
                                policyToPolicyDirectories: {} as any,
                            },
                            policyDirectory: {} as any
                        }
                    ],
                }, {
                    id: faker.string.uuid(),
                    directoryName: faker.book.title(),
                    policyToPolicyDirectories: [
                        {
                            id: faker.string.uuid(),
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            policy: {
                                id: faker.string.uuid(),
                                policyName: faker.book.title(),
                                policyNumber: faker.number.int(),
                                state: State.ACTIVE,
                                type: Type.DIRECTIVE,
                                dateActive: faker.date.anytime(),
                                content: faker.book.genre(),
                                createdAt: new Date(),
                                updatedAt: new Date(),
                                posts: {} as any,
                                organization: {} as any,
                                user: {} as any,
                                account: account,
                                files: {} as any,
                                policyToPolicyDirectories: {} as any,
                            },
                            policyDirectory: {} as any
                        },
                        {
                            id: faker.string.uuid(),
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            policy: {
                                id: faker.string.uuid(),
                                policyName: faker.book.title(),
                                policyNumber: faker.number.int(),
                                state: State.ACTIVE,
                                type: Type.DIRECTIVE,
                                dateActive: faker.date.anytime(),
                                content: faker.book.genre(),
                                createdAt: new Date(),
                                updatedAt: new Date(),
                                posts: {} as any,
                                organization: {} as any,
                                user: {} as any,
                                account: account,
                                files: {} as any,
                                policyToPolicyDirectories: {} as any,
                            },
                            policyDirectory: {} as any
                        }
                    ],
                },
            ]

            const policyDirectoryRepositoryFindAllSpy = jest.spyOn(policyDirectoryRepository, 'find').mockResolvedValue(policyDirectories as PolicyDirectory[]);

            const result = await policyDirectoryService.findAllForAccount(account);
            expect(result).toMatchObject(policyDirectories);
            expect(policyDirectoryRepositoryFindAllSpy).toHaveBeenCalledWith({
                where: { account: { id: account.id } },
                relations: []
            });
        });
    });

    describe('finding one policyDirectory', () => {
        it('throws an error when a policyDirectory doesnt exist', async () => {
            const policyDirectoryId = faker.string.uuid();

            const policyDirectoryRepositoryFindOneSpy = jest
                .spyOn(policyDirectoryRepository, 'findOne')
                .mockResolvedValue(null);

            expect.assertions(3);

            try {
                await policyDirectoryService.findOneById(policyDirectoryId, ['policyToPolicyDirectories.policy']);
            } catch (e) {
                expect(e).toBeInstanceOf(NotFoundException);
                expect(e.message).toBe(`Папка с ID: ${policyDirectoryId} не найдена`);
            }

            expect(policyDirectoryRepositoryFindOneSpy).toHaveBeenCalledWith({
                where: { id: policyDirectoryId },
                relations: ['policyToPolicyDirectories.policy'],
            });
        });

        it('returns the found policyDirectory', async () => {
            const policyDirectoryId = faker.string.uuid();

            const existingPolicyDirectory: PolicyDirectoryReadDto = {
                id: policyDirectoryId,
                directoryName: faker.book.title(),
                policyToPolicyDirectories: [
                    {
                        id: faker.string.uuid(),
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        policy: {
                            id: faker.string.uuid(),
                            policyName: faker.book.title(),
                            policyNumber: faker.number.int(),
                            state: State.ACTIVE,
                            type: Type.DIRECTIVE,
                            dateActive: faker.date.anytime(),
                            content: faker.book.genre(),
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            posts: {} as any,
                            organization: {} as any,
                            user: {} as any,
                            account: {} as any,
                            files: {} as any,
                            policyToPolicyDirectories: {} as any,
                        },
                        policyDirectory: {} as any
                    },
                    {
                        id: faker.string.uuid(),
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        policy: {
                            id: faker.string.uuid(),
                            policyName: faker.book.title(),
                            policyNumber: faker.number.int(),
                            state: State.ACTIVE,
                            type: Type.DIRECTIVE,
                            dateActive: faker.date.anytime(),
                            content: faker.book.genre(),
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            posts: {} as any,
                            organization: {} as any,
                            user: {} as any,
                            account: {} as any,
                            files: {} as any,
                            policyToPolicyDirectories: {} as any,
                        },
                        policyDirectory: {} as any
                    }
                ],
            }

            const policyDirectoryRepositoryFindOneSpy = jest
                .spyOn(policyDirectoryRepository, 'findOne')
                .mockResolvedValue(existingPolicyDirectory as PolicyDirectory);

            const result = await policyDirectoryService.findOneById(policyDirectoryId, ['policyToPolicyDirectories.policy']);
            expect(result).toMatchObject(existingPolicyDirectory);
            expect(policyDirectoryRepositoryFindOneSpy).toHaveBeenCalledWith({
                where: { id: policyDirectoryId },
                relations: ['policyToPolicyDirectories.policy'],
            });
        });
    });

    describe('creating a policyDirectory', () => {
        it('calls the repository with correct paramaters', async () => {

            const policyDirectoryId = faker.string.uuid();
            const directoryName = faker.book.title();
            const policyToPolicyDirectories = faker.helpers.multiple(() => faker.string.uuid(), {
                count: 3,
            });

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

            const policyDirectoryCreateDto: PolicyDirectoryCreateDto = {
                directoryName: directoryName,
                policyToPolicyDirectories: policyToPolicyDirectories,
                account: account
            }

            const savedPolicyDirectory: PolicyDirectoryReadDto = {
                id: policyDirectoryId,
                directoryName: directoryName,
                policyToPolicyDirectories: [],
            }

            const policyDirectoryRepositorySaveSpy = jest
                .spyOn(policyDirectoryRepository, 'save')
                .mockResolvedValue(savedPolicyDirectory as PolicyDirectory);



            const result = await policyDirectoryService.create(policyDirectoryCreateDto);

            expect(policyDirectoryRepositorySaveSpy).toHaveBeenCalledWith(policyDirectoryCreateDto);
            expect(result).toEqual(savedPolicyDirectory);
        });
    });


    // describe('updating a policy', () => {
    //     it('throws an error when a policy doesnt exist', async () => {
    //         const policyId = faker.string.uuid()
    //         const policyName = faker.book.title();
    //         const state = State.ACTIVE;
    //         const type = Type.DIRECTIVE;
    //         const content = faker.book.genre();

    //         const organization: Organization = {
    //             id: faker.string.uuid(),
    //             organizationName: faker.company.name(),
    //             parentOrganizationId: null,
    //             reportDay: ReportDay.FRIDAY,
    //             createdAt: new Date(),
    //             updatedAt: new Date(),
    //             goal: null,
    //             users: null,
    //             posts: null,
    //             policies: null,
    //             projects: null,
    //             strategies: null,
    //             account: null,
    //         };
    //         const updatePolicyDto: PolicyUpdateDto = {
    //             _id: policyId,
    //             policyName: policyName,
    //             state: state,
    //             type: type,
    //             content: content,
    //             organizationId: organization.id,
    //             organization: organization
    //         }
    //         const policyRepositoryFindOneSpy = jest
    //             .spyOn(policyRepository, 'findOne')
    //             .mockResolvedValue(null);

    //         expect.assertions(3);

    //         try {
    //             await policyService.update(policyId, updatePolicyDto);
    //         } catch (e) {
    //             expect(e).toBeInstanceOf(NotFoundException);
    //             expect(e.message).toBe(`Политика с ID ${policyId} не найдена`);
    //         }
    //         expect(policyRepositoryFindOneSpy).toHaveBeenCalledWith({
    //             where: { id: policyId }
    //         });
    //     });

    //     it('returns the updated objectiveId', async () => {
    //         const policyId = faker.string.uuid()
    //         const policyName = faker.book.title();
    //         const state = State.ACTIVE;
    //         const type = Type.DIRECTIVE;
    //         const content = faker.book.genre();

    //         const organization: Organization = {
    //             id: faker.string.uuid(),
    //             organizationName: faker.company.name(),
    //             parentOrganizationId: null,
    //             reportDay: ReportDay.FRIDAY,
    //             createdAt: new Date(),
    //             updatedAt: new Date(),
    //             goal: null,
    //             users: null,
    //             posts: null,
    //             policies: null,
    //             projects: null,
    //             strategies: null,
    //             account: null,
    //         };
    //         const updatePolicyDto: PolicyUpdateDto = {
    //             _id: policyId,
    //             policyName: policyName,
    //             state: state,
    //             type: type,
    //             content: content,
    //             organizationId: organization.id,
    //             organization: organization
    //         }

    //         const existingPolicy: PolicyReadDto = {
    //             id: policyId,
    //             policyName: policyName,
    //             policyNumber: faker.number.int(),
    //             state: state,
    //             type: type,
    //             dateActive: faker.date.anytime(),
    //             content: content,
    //             createdAt: new Date(),
    //             updatedAt: new Date(),
    //             posts: {} as any,
    //             organization: {} as any,
    //             user: {} as any,
    //             account: {} as any,
    //             files: {} as any,
    //             policyToPolicyDirectories: {} as any,
    //         };

    //         const policyRepositoryFindOneSpy = jest
    //             .spyOn(policyRepository, 'findOne')
    //             .mockResolvedValue(existingPolicy);

    //         const policyRepositoryUpdateSpy = jest
    //             .spyOn(policyRepository, 'update')
    //             .mockResolvedValue({
    //                 generatedMaps: [],
    //                 raw: [],
    //                 affected: 1
    //             });

    //         const result = await policyService.update(policyId, updatePolicyDto);
    //         expect(result).toMatch(existingPolicy.id);
    //         expect(policyRepositoryFindOneSpy).toHaveBeenCalledWith({
    //             where: { id: policyId }
    //         });
    //         expect(policyRepositoryUpdateSpy).toHaveBeenCalledWith(
    //             policyId,
    //             expect.objectContaining({
    //                 policyName: policyName,
    //                 state: state,
    //                 type: type,
    //                 content: content,
    //                 organization: organization
    //             })
    //         );
    //     });
    // });
});