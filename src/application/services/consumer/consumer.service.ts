import { Injectable, OnModuleInit, Logger, Inject } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import { AccountService } from '../account/account.service';
import { UsersService } from '../users/users.service';
import { OrganizationService } from '../organization/organization.service';
import { AccountCreateDto } from 'src/contracts/account/create-account.dto';
import { CreateUserDto } from 'src/contracts/user/create-user.dto';
import { RoleService } from '../role/role.service';
import { OrganizationCreateDto } from 'src/contracts/organization/create-organization.dto';
import { PostService } from '../post/post.service';
import { Roles } from 'src/domains/role.entity';
import { PostCreateDto } from 'src/contracts/post/create-post.dto';
import { PolicyService } from '../policy/policy.service';

@Injectable()
export class ConsumerService implements OnModuleInit {
  private channelWrapper: ChannelWrapper;
  private readonly logger = new Logger(ConsumerService.name);

  constructor(
    private readonly accountService: AccountService,
    private readonly userService: UsersService,
    private readonly organizationService: OrganizationService,
    private readonly roleService: RoleService,
    private readonly postService: PostService,
    private readonly policyService: PolicyService
  ) {
    // Подключение к RabbitMQ с правильными учетными данными
    const connection = amqp.connect([{
      hostname: 'goodmanagement.ru',
      username: 'nest-backend',
      password: 'pV<U47X1ES7?',
      vhost: '/'
    }]);

    this.channelWrapper = connection.createChannel();
  }

  public async onModuleInit() {
    try {
      // Настройка очереди и потребление сообщений
      await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
        await channel.assertQueue('gm-to-nest-events', { durable: true });
        await channel.consume('gm-to-nest-events', async (message) => {
          if (message) {
            const event = JSON.parse(message.content.toString());
            this.logger.log(`Received message: ${JSON.stringify(event)}`);

            // Пример обработки события TenantCreatedEvent
            if (event.eventType === 'TENANT_CREATED') {
              this.handleTenantCreatedEvent(event);
            }

            switch (event.eventType) {
              case 'TENANT_CREATED':
                await this.handleTenantCreatedEvent(event);
                break;
              case 'ORGANIZATION_CREATED':
                break;

            }

            // Подтверждение сообщения
            channel.ack(message);
          }
        });
      });

      this.logger.log('Consumer service started and listening for messages.');
    } catch (err) {
      this.logger.error('Error starting the consumer:', err);
    }
  }

  // Обработка события TenantCreatedEvent
  private async handleTenantCreatedEvent(event: any) {
    const payload = event.payload;
    this.logger.log(`Handling TenantCreatedEvent: ${JSON.stringify(payload)}`);
    const accountCreateDto: AccountCreateDto = {
      id: payload.company.id,
      accountName: payload.company.name,
      tenantId: payload.company.tenantId
    }
    const createdAccount = await this.accountService.create(accountCreateDto);
    const ownerRole = await this.roleService.findOneByName(Roles.OWNER);
    const userCreateDto: CreateUserDto = {
      id: payload.id,
      firstName: payload.firstName,
      lastName: payload.lastName,
      middleName: payload.middleName,
      telephoneNumber: payload.phone,
      role: ownerRole,
      account: createdAccount
    }
    await this.userService.create(userCreateDto);
    // Здесь можно реализовать сохранение данных или другую логику
  }

  // private async handleOrganizationCreatedEvent(event: any) {
  //   const payload = event.payload;
  //   this.logger.log(`Handling OrganizationCreatedEvent: ${JSON.stringify(payload)}`);
  //   const account = await this.accountService.findOneById(event.accountId)
  //   const organizationCreateDto: OrganizationCreateDto = {
  //     id: payload.id,
  //     organizationName: payload.name,
  //     parentOrganizationId: payload.parentId,
  //     account: account
  //   }
  //   const createdOrganization = await this.organizationService.create(organizationCreateDto);

  //   const employeeRole = await this.roleService.findOneByName(Roles.EMPLOYEE);

  //   const createEmployeesPromises = payload.users.map(async (user: any) => {
  //     const userCreateDto: CreateUserDto = {
  //       id: user.id,
  //       firstName: user.firstName,
  //       lastName: user.lastName,
  //       middleName: user.middleName,
  //       telephoneNumber: user.phone,
  //       role: employeeRole,
  //       account: account
  //     }
  //     return await this.userService.create(userCreateDto);
  //   });
  //   await Promise.all(createEmployeesPromises);

  //   const createPostsPromises = payload.posts.map(async (post: any) => {
  //     const responsibleUser = post.userId !== null ? await this.userService.findOne(post.userId) : null;
  //     const policy = post.policyId !== null ? await this.policyService.findOneById(post.policyId) : null;
  //     const postCreateDto: PostCreateDto = {
  //       id: post.id,
  //       postName: post.name,
  //       divisionName: post.divisionName,
  //       parentId: post.parentId,
  //       product: post.valuableEndProduct,
  //       purpose: post.,
  //       user: responsibleUser,
  //       organization: createdOrganization,
  //       policy: policy,
  //       account: account
  //     }
  //     return await this.postService.create(postCreateDto);
  //   });
  //   await Promise.all(createPostsPromises);
  //   // Здесь можно реализовать сохранение данных или другую логику
  // }
}



