import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostService } from "../services/post/post.service";
import { PostRepository } from "../services/post/repository/post.repository";
import { Post } from "src/domains/post.entity";
import { PostController } from "src/controllers/post.controller";
import { UsersModule } from "./users.module";
import { PolicyModule } from "./policy.module";
import { OrganizationModule } from "./organization.module";


@Module({
    imports: [TypeOrmModule.forFeature([Post]), UsersModule, PolicyModule, OrganizationModule],
    controllers: [PostController],
    providers: [PostService, PostRepository],
    exports: [PostService]
})
export class PostModule{}