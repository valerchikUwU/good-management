import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from 'src/utils/winston-logger';
import { RepositoryFake } from '../FakeClasses/repositoryFake';
import { faker } from '@faker-js/faker/.';
import { Organization, ReportDay } from 'src/domains/organization.entity';
import { PostService } from 'src/application/services/post/post.service';
import { PostRepository } from 'src/application/services/post/repository/post.repository';
import { PostReadDto } from 'src/contracts/post/read-post.dto';
import { Post } from 'src/domains/post.entity';
import { Account } from 'src/domains/account.entity';
import { IsNull } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { PostCreateDto } from 'src/contracts/post/create-post.dto';

describe('PostService', () => {
    let postService: PostService;
    let postRepository: PostRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [WinstonModule.forRoot(winstonConfig)],
            providers: [
                PostService,
                {
                    provide: getRepositoryToken(Post),
                    useClass: RepositoryFake,
                },
            ],
        }).compile();
        postService = module.get(PostService);
        postRepository = module.get(getRepositoryToken(Post));
    });



    describe('finding all posts', () => {


        it('returns all posts for organization', async () => {

            const organization: Organization = {
                id: faker.string.uuid(),
                organizationName: faker.company.name(),
                parentOrganizationId: null,
                reportDay: ReportDay.FRIDAY,
                createdAt: new Date(),
                updatedAt: new Date(),
                goal: null,
                users: null,
                posts: null,
                policies: null,
                projects: null,
                strategies: null,
                account: null,
            };

            const existingPosts: PostReadDto[] = [
                {
                    id: faker.string.uuid(),
                    postName: faker.person.jobType(),
                    divisionName: faker.person.jobDescriptor(),
                    divisionNumber: faker.number.int(),
                    parentId: faker.string.uuid(),
                    product: faker.commerce.product(),
                    purpose: faker.commerce.productDescription(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    user: {} as any,
                    policy: {} as any,
                    statistics: {} as any,
                    organization: organization,
                    account: {} as any,
                    historiesUsersToPost: {} as any
                },
                {
                    id: faker.string.uuid(),
                    postName: faker.person.jobType(),
                    divisionName: faker.person.jobDescriptor(),
                    divisionNumber: faker.number.int(),
                    parentId: faker.string.uuid(),
                    product: faker.commerce.product(),
                    purpose: faker.commerce.productDescription(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    user: {} as any,
                    policy: {} as any,
                    statistics: {} as any,
                    organization: organization,
                    account: {} as any,
                    historiesUsersToPost: {} as any
                },
                {
                    id: faker.string.uuid(),
                    postName: faker.person.jobType(),
                    divisionName: faker.person.jobDescriptor(),
                    divisionNumber: faker.number.int(),
                    parentId: faker.string.uuid(),
                    product: faker.commerce.product(),
                    purpose: faker.commerce.productDescription(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    user: {} as any,
                    policy: {} as any,
                    statistics: {} as any,
                    organization: {} as any,
                    account: {} as any,
                    historiesUsersToPost: {} as any
                }
            ]


            const postRepositoryFindAllSpy = jest
                .spyOn(postRepository, 'find')
                .mockResolvedValue(existingPosts);

            const result = await postService.findAllForOrganization(organization);
            expect(result).toMatchObject(existingPosts);
            expect(postRepositoryFindAllSpy).toHaveBeenCalledWith({
                where: { organization: { id: organization.id } },
            });
        });


        it('returns all posts for account', async () => {

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

            const existingPosts: PostReadDto[] = [
                {
                    id: faker.string.uuid(),
                    postName: faker.person.jobType(),
                    divisionName: faker.person.jobDescriptor(),
                    divisionNumber: faker.number.int(),
                    parentId: faker.string.uuid(),
                    product: faker.commerce.product(),
                    purpose: faker.commerce.productDescription(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    user: {} as any,
                    policy: {} as any,
                    statistics: {} as any,
                    organization: {} as any,
                    account: account,
                    historiesUsersToPost: {} as any
                },
                {
                    id: faker.string.uuid(),
                    postName: faker.person.jobType(),
                    divisionName: faker.person.jobDescriptor(),
                    divisionNumber: faker.number.int(),
                    parentId: faker.string.uuid(),
                    product: faker.commerce.product(),
                    purpose: faker.commerce.productDescription(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    user: {} as any,
                    policy: {} as any,
                    statistics: {} as any,
                    organization: {} as any,
                    account: account,
                    historiesUsersToPost: {} as any
                },
                {
                    id: faker.string.uuid(),
                    postName: faker.person.jobType(),
                    divisionName: faker.person.jobDescriptor(),
                    divisionNumber: faker.number.int(),
                    parentId: faker.string.uuid(),
                    product: faker.commerce.product(),
                    purpose: faker.commerce.productDescription(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    user: {} as any,
                    policy: {} as any,
                    statistics: {} as any,
                    organization: {} as any,
                    account: {} as any,
                    historiesUsersToPost: {} as any
                }
            ]


            const postRepositoryFindAllSpy = jest
                .spyOn(postRepository, 'find')
                .mockResolvedValue(existingPosts);

            const result = await postService.findAllForAccount(account);
            expect(result).toMatchObject(existingPosts);
            expect(postRepositoryFindAllSpy).toHaveBeenCalledWith({
                where: { account: { id: account.id } },
                relations: []
            });
        });


        it('returns all posts without parentId', async () => {


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

            const existingPosts: PostReadDto[] = [
                {
                    id: faker.string.uuid(),
                    postName: faker.person.jobType(),
                    divisionName: faker.person.jobDescriptor(),
                    divisionNumber: faker.number.int(),
                    parentId: null,
                    product: faker.commerce.product(),
                    purpose: faker.commerce.productDescription(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    user: {} as any,
                    policy: {} as any,
                    statistics: {} as any,
                    organization: {} as any,
                    account: account,
                    historiesUsersToPost: {} as any
                },
                {
                    id: faker.string.uuid(),
                    postName: faker.person.jobType(),
                    divisionName: faker.person.jobDescriptor(),
                    divisionNumber: faker.number.int(),
                    parentId: null,
                    product: faker.commerce.product(),
                    purpose: faker.commerce.productDescription(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    user: {} as any,
                    policy: {} as any,
                    statistics: {} as any,
                    organization: {} as any,
                    account: account,
                    historiesUsersToPost: {} as any
                },
                {
                    id: faker.string.uuid(),
                    postName: faker.person.jobType(),
                    divisionName: faker.person.jobDescriptor(),
                    divisionNumber: faker.number.int(),
                    parentId: faker.string.uuid(),
                    product: faker.commerce.product(),
                    purpose: faker.commerce.productDescription(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    user: {} as any,
                    policy: {} as any,
                    statistics: {} as any,
                    organization: {} as any,
                    account: account,
                    historiesUsersToPost: {} as any
                }
            ]


            const postRepositoryFindAllSpy = jest
                .spyOn(postRepository, 'find')
                .mockResolvedValue(existingPosts);

            const result = await postService.findAllWithoutParentId(account);
            expect(result).toMatchObject(existingPosts);
            expect(postRepositoryFindAllSpy).toHaveBeenCalledWith({
                where: { account: { id: account.id }, parentId: IsNull() },
                relations: ['user', 'organization'],
            });
        });
    });

    describe('finding a post', () => {
        it('throws an error when a post doesnt exist', async () => {
            const postId = faker.string.uuid();

            const postRepositoryFindOneSpy = jest
                .spyOn(postRepository, 'findOne')
                .mockResolvedValue(null);

            expect.assertions(3);

            try {
                await postService.findOneById(postId);
            } catch (e) {
                expect(e).toBeInstanceOf(NotFoundException);
                expect(e.message).toBe(`Пост с ID: ${postId} не найден`);
            }

            expect(postRepositoryFindOneSpy).toHaveBeenCalledWith({
                where: { id: postId },
                relations: [],
            });
        });

        it('returns the found post', async () => {
            const postId = faker.string.uuid();

            const existingPost: PostReadDto = {
                id: postId,
                postName: faker.person.jobType(),
                divisionName: faker.person.jobDescriptor(),
                divisionNumber: faker.number.int(),
                parentId: null,
                product: faker.commerce.product(),
                purpose: faker.commerce.productDescription(),
                createdAt: new Date(),
                updatedAt: new Date(),
                user: {} as any,
                policy: {} as any,
                statistics: {} as any,
                organization: {} as any,
                account: {} as any,
                historiesUsersToPost: {} as any
            }

            const postRepositoryFindOneSpy = jest
                .spyOn(postRepository, 'findOne')
                .mockResolvedValue(existingPost);

            const result = await postService.findOneById(postId);
            expect(result).toMatchObject(existingPost);
            expect(postRepositoryFindOneSpy).toHaveBeenCalledWith({
                where: { id: postId },
                relations: [],
            });
        });

        it('returns the max divisionNumber', async () => {

            const postWithMaxDivisionNumber: Post =
            {
                id: faker.string.uuid(),
                postName: faker.person.jobType(),
                divisionName: faker.person.jobDescriptor(),
                divisionNumber: 20,
                parentId: null,
                product: faker.commerce.product(),
                purpose: faker.commerce.productDescription(),
                createdAt: new Date(),
                updatedAt: new Date(),
                user: {} as any,
                policy: {} as any,
                statistics: {} as any,
                organization: {} as any,
                account: {} as any,
                historiesUsersToPost: {} as any
            }
            const orderBySpy = jest.fn().mockReturnThis(); // `orderBy` возвращает `this`
            const getOneSpy = jest.fn().mockResolvedValue(postWithMaxDivisionNumber);


            // Мокируем createQueryBuilder
            jest.spyOn(postRepository, 'createQueryBuilder').mockReturnValue({
                orderBy: orderBySpy,
                getOne: getOneSpy,
            } as any);

            // Вызываем тестируемый метод
            const result = await postService.findMaxDivisionNumber();

            // Проверяем результат
            expect(result).toEqual(postWithMaxDivisionNumber.divisionNumber);

            // Проверяем вызовы
            expect(orderBySpy).toHaveBeenCalledWith('post.divisionNumber', 'DESC');
            expect(getOneSpy).toHaveBeenCalledTimes(1); // Убедимся, что `getOne` вызвался

        });

        it('returns the postsIds due to their hierarchy from below to top', async () => {

            const postId_1 = faker.string.uuid();
            const postId_2 = faker.string.uuid();
            const postId_3 = faker.string.uuid();

            const existingPosts: PostReadDto[] = [
                {
                    id: postId_1,
                    postName: faker.person.jobType(),
                    divisionName: faker.person.jobDescriptor(),
                    divisionNumber: faker.number.int(),
                    parentId: null,
                    product: faker.commerce.product(),
                    purpose: faker.commerce.productDescription(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    user: {} as any,
                    policy: {} as any,
                    statistics: {} as any,
                    organization: {} as any,
                    account: {} as any,
                    historiesUsersToPost: {} as any
                },
                {
                    id: postId_2,
                    postName: faker.person.jobType(),
                    divisionName: faker.person.jobDescriptor(),
                    divisionNumber: faker.number.int(),
                    parentId: postId_1,
                    product: faker.commerce.product(),
                    purpose: faker.commerce.productDescription(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    user: {} as any,
                    policy: {} as any,
                    statistics: {} as any,
                    organization: {} as any,
                    account: {} as any,
                    historiesUsersToPost: {} as any
                },
                {
                    id: postId_3,
                    postName: faker.person.jobType(),
                    divisionName: faker.person.jobDescriptor(),
                    divisionNumber: faker.number.int(),
                    parentId: postId_2,
                    product: faker.commerce.product(),
                    purpose: faker.commerce.productDescription(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    user: {} as any,
                    policy: {} as any,
                    statistics: {} as any,
                    organization: {} as any,
                    account: {} as any,
                    historiesUsersToPost: {} as any
                }
            ]
            // Мокаем вызовы `findOne` для каждой итерации
            const findOneSpy = jest.spyOn(postRepository, 'findOne')
                .mockResolvedValueOnce(existingPosts[2]) // Первый вызов вернет первый пост
                .mockResolvedValueOnce(existingPosts[1]) // Второй вызов вернет второй пост
                .mockResolvedValueOnce(existingPosts[0]) // Третий вызов вернет верхний пост

            const result = await postService.getHierarchyToTop(postId_3);

            // Проверяем результат
            expect(result).toEqual([postId_3, postId_2, postId_1]); // Ожидаем массив ID постов

            // Проверяем вызовы findOne
            expect(findOneSpy).toHaveBeenCalledTimes(3); // Вызван 3 раза
            expect(findOneSpy).toHaveBeenCalledWith({ where: { id: postId_3 }, relations: ['user'] });
            expect(findOneSpy).toHaveBeenCalledWith({ where: { id: postId_2 }, relations: ['user'] });
            expect(findOneSpy).toHaveBeenCalledWith({ where: { id: postId_1 }, relations: ['user'] });

        });

    });

      describe('creating a post', () => {

        it('calls the repository with correct paramaters', async () => {

            const postName = faker.person.jobTitle(); 
            const divisionName = faker.commerce.department();
            const parentId = faker.string.uuid();
            const product = faker.commerce.product();
            const purpose = faker.person.jobDescriptor();
            const responsibleUserId = faker.string.uuid();
            const organizationId = faker.string.uuid();

            const user = {
                id: responsibleUserId,
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                middleName: faker.person.middleName(),
                telegramId: faker.number.int(),
                telephoneNumber: faker.phone.number(),
                avatar_url: faker.internet.url(),
                vk_id: faker.number.int(),
                createdAt: new Date(),
                updatedAt: new Date(),
                posts: {} as any,
                refreshSessions: {} as any,
                goals: {} as any,
                policies: {} as any,
                strategies: {} as any,
                targetHolders: {} as any,
                projects: {} as any,
                organization: {} as any,
                account: {} as any,
                role: {} as any,
                convert: {} as any,
                convertToUsers: {} as any,
                messages: {} as any,
                groupToUsers: {} as any,
                historiesUsersToPost: {} as any,
            }
            const organization: Organization = {
                id: organizationId,
                organizationName: faker.company.name(),
                parentOrganizationId: null,
                reportDay: ReportDay.FRIDAY,
                createdAt: new Date(),
                updatedAt: new Date(),
                goal: null,
                users: null,
                posts: null,
                policies: null,
                projects: null,
                strategies: null,
                account: null,
            };


          const postCreateDto: PostCreateDto = {
            postName: postName,
            divisionName: divisionName,
            parentId: parentId,
            product: product,
            purpose: purpose,
            responsibleUserId: responsibleUserId,
            organizationId: organizationId,
            user: user,
            account: {} as any,
            organization: organization,
            policy: {} as any
          }

          const savedPost: Post = {
            id: faker.string.uuid(),
            postName: postName,
            divisionName: divisionName,
            divisionNumber: faker.number.int(),
            parentId: parentId,
            product: product,
            purpose: purpose,
            createdAt: new Date(),
            updatedAt: new Date(),
            user: user,
            account: {} as any,
            organization: organization,
            policy: {} as any,
            statistics: {} as any,
            historiesUsersToPost: {} as any
          };

          const postRepositoryInsertSpy = jest
            .spyOn(postRepository, 'insert')
            .mockResolvedValue({
              identifiers: [{ id: savedPost.id }],
              generatedMaps: [],
              raw: [],
            });

          const result = await postService.create(postCreateDto);

          expect(postRepositoryInsertSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                postName: postName,
                divisionName: divisionName,
                parentId: parentId,
                product: product,
                purpose: purpose,
                user: user,
                account: {} as any,
                organization: organization,
                policy: {} as any
            }),
          );
          expect(result).toEqual(savedPost.id);
        });
      });

    //   describe('finding a goal', () => {
    //     it('throws an error when a goal doesnt exist', async () => {
    //       const goalId = faker.string.uuid();

    //       const goalRepositoryFindOneSpy = jest
    //         .spyOn(goalRepository, 'findOne')
    //         .mockResolvedValue(null);

    //       expect.assertions(3);

    //       try {
    //         await goalService.findOneById(goalId, ['organization']);
    //       } catch (e) {
    //         expect(e).toBeInstanceOf(NotFoundException);
    //         expect(e.message).toBe(`Цель с ID: ${goalId} не найдена!`);
    //       }

    //       expect(goalRepositoryFindOneSpy).toHaveBeenCalledWith({
    //         where: { id: goalId },
    //         relations: ['organization'],
    //       });
    //     });

    //     it('returns the found goal', async () => {
    //       const goalId = faker.string.uuid();

    //       const existingGoal: GoalReadDto = {
    //         id: goalId,
    //         content: faker.helpers.multiple(() => faker.animal.cat(), {
    //           count: 3,
    //         }),
    //         createdAt: new Date(),
    //         updatedAt: new Date(),
    //         organization: {
    //           id: faker.string.uuid(),
    //           organizationName: faker.company.name(),
    //           parentOrganizationId: null,
    //           reportDay: ReportDay.FRIDAY,
    //           createdAt: new Date(),
    //           updatedAt: new Date(),
    //           goal: null,
    //           users: null,
    //           posts: null,
    //           policies: null,
    //           projects: null,
    //           strategies: null,
    //           account: null,
    //         },
    //       };

    //       const goalRepositoryFindOneSpy = jest
    //         .spyOn(goalRepository, 'findOne')
    //         .mockResolvedValue(existingGoal as Goal);

    //       const result = await goalService.findOneById(goalId, ['organization']);
    //       expect(result).toMatchObject<GoalReadDto>(existingGoal);
    //       expect(goalRepositoryFindOneSpy).toHaveBeenCalledWith({
    //         where: { id: goalId },
    //         relations: ['organization'],
    //       });
    //     });
    //   });




    //   describe('updating a goal', () => {
    //     it('throws an error when a goal doesnt exist', async () => {

    //       const goalId = faker.string.uuid()
    //       const updateGoalDto: GoalUpdateDto = {
    //         _id: goalId,
    //         content: faker.helpers.multiple(() => faker.animal.cat(), {
    //           count: 3,
    //         }),
    //       }

    //       const goalRepositoryFindOneSpy = jest
    //         .spyOn(goalRepository, 'findOne')
    //         .mockResolvedValue(null);

    //       expect.assertions(3);

    //       try {
    //         await goalService.update(goalId, updateGoalDto);
    //       } catch (e) {
    //         expect(e).toBeInstanceOf(NotFoundException);
    //         expect(e.message).toBe(`Цель с ID ${goalId} не найдена`);
    //       }
    //       expect(goalRepositoryFindOneSpy).toHaveBeenCalledWith({
    //         where: { id: goalId }
    //       });
    //     });

    //     it('returns the updated goalId', async () => {
    //       const goalId = faker.string.uuid();

    //       const updateGoalDto: GoalUpdateDto = {
    //         _id: goalId,
    //         content: faker.helpers.multiple(() => faker.animal.cat(), {
    //           count: 3,
    //         }),
    //       }

    //       const existingGoal: GoalReadDto = {
    //         id: goalId,
    //         content: faker.helpers.multiple(() => faker.animal.cat(), {
    //           count: 3,
    //         }),
    //         createdAt: new Date(),
    //         updatedAt: new Date(),
    //         organization: {} as any,
    //         user: {} as any,
    //         account: {} as any
    //       };

    //       const goalRepositoryFindOneSpy = jest
    //         .spyOn(goalRepository, 'findOne')
    //         .mockResolvedValue(existingGoal as Goal);

    //       const goalRepositoryUpdateSpy = jest
    //         .spyOn(goalRepository, 'update')
    //         .mockResolvedValue({
    //           generatedMaps: [],
    //           raw: [],
    //           affected: 1
    //         });

    //       const result = await goalService.update(goalId, updateGoalDto);
    //       expect(result).toMatch(existingGoal.id);
    //       expect(goalRepositoryFindOneSpy).toHaveBeenCalledWith({
    //         where: { id: goalId }
    //       });
    //       expect(goalRepositoryUpdateSpy).toHaveBeenCalledWith(
    //         goalId,
    //         expect.objectContaining({
    //         content: updateGoalDto.content
    //       }));
    //     });
    //   });
});
