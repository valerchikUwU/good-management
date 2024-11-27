import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostService } from '../services/post/post.service';
import { PostRepository } from '../services/post/repository/post.repository';
import { Post } from 'src/domains/post.entity';
import { PostController } from 'src/controllers/post.controller';
import { UsersModule } from './users.module';
import { PolicyModule } from './policy.module';
import { OrganizationModule } from './organization.module';
import { QueueModule } from './queue.module';
import { GroupModule } from './group.module';
import { HistoryUsersToPostModule } from './historyUsersToPost.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    UsersModule,
    PolicyModule,
    OrganizationModule,
    forwardRef(() => QueueModule),
    GroupModule,
    HistoryUsersToPostModule
  ],
  controllers: [PostController],
  providers: [PostService, PostRepository],
  exports: [PostService]
})
export class PostModule {}
