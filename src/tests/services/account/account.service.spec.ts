import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { AccountRepositoryFake } from "./FakeClasses/account-repositoryFake";
import { BadRequestException } from "@nestjs/common";
import { faker } from '@faker-js/faker';
import { AccountCreateDto } from "../../../contracts/account/create-account.dto";
import { Account } from "../../../domains/account.entity";
import { AccountRepository } from "../../../application/services/account/repository/account.repository";
import { AccountService } from "../../../application/services/account/account.service";

describe('AccountService', () => {
    let accountService: AccountService;
    let accountRepository: AccountRepository;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
            AccountService,
          {
            provide: getRepositoryToken(Account),
            useClass: AccountRepositoryFake,
          },
        ],
      }).compile();
  
      accountService = module.get(AccountService);
      accountRepository = module.get(getRepositoryToken(Account));
    });

    describe('creating an account', () => {
      it('throws an error when validation error is provided', async () => {
        expect.assertions(2);
    
        try {
          await accountService.create({ id: '', accountName: 'test', tenantId: 'c57ea086-f439-4ee6-b618-74e4a780937d' });
        } catch (e) {
          expect(e).toBeInstanceOf(BadRequestException);
          expect(e.message).toBe('validation error.');
        }
      });

      it('calls the repository with correct paramaters', async () => {
        const id = faker.string.uuid();
        const accountName = faker.company.name();
        const tenantId = faker.string.uuid();
    
        const accountCreateDto: AccountCreateDto = {
          id,
          accountName,
          tenantId
        };
    
        const createdAccount: Account = {
          id: id,
          accountName: accountName,
          tenantId: tenantId,
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
    
        const savedAccount: Account = {
          id: id,
          accountName: accountName,
          tenantId: tenantId,
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

        
        const accountRepositorySaveSpy = jest
          .spyOn(accountRepository, 'save')
          .mockResolvedValue(savedAccount);
    
        const accountRepositoryCreateSpy = jest
          .spyOn(accountRepository, 'create')
          .mockReturnValue(createdAccount);
    
        const result = await accountService.create(accountCreateDto);
    
        expect(accountRepositoryCreateSpy).toBeCalledWith(accountCreateDto);
        expect(accountRepositorySaveSpy).toBeCalledWith(createdAccount);
        expect(result).toEqual(savedAccount);
      });
    });
  });


