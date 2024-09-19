import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Post } from "src/domains/post.entity";
import { PostRepository } from "./repository/post.repository";
import { PostReadDto } from "src/contracts/post/read-post.dto";
import { PostCreateDto } from "src/contracts/post/create-post.dto";
import { OrganizationReadDto } from "src/contracts/organization/read-organization.dto";
import { AccountReadDto } from "src/contracts/account/read-account.dto";



@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: PostRepository
    ) {

    }

    async findAll(): Promise<PostReadDto[]> {
        const posts = await this.postRepository.find();

        return posts.map(post => ({

            id: post.id,
            postName: post.postName,
            divisionName: post.divisionName,
            parentId: post.parentId,
            product: post.product,
            purpose: post.purpose,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            user: post.user,
            policy: post.policy,
            statistics: post.statistics,
            organization: post.organization
        }))
    }

        
    async findAllForOrganization(organization: OrganizationReadDto): Promise<PostReadDto[]> {
        const posts = await this.postRepository.find({where: {organization: {id: organization.id}}});

        return posts.map(post => ({

            id: post.id,
            postName: post.postName,
            divisionName: post.divisionName,
            parentId: post.parentId,
            product: post.product,
            purpose: post.purpose,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            user: post.user,
            policy: post.policy,
            statistics: post.statistics,
            organization: post.organization
        }))
    }
    
    async findAllForAccount(account: AccountReadDto): Promise<PostReadDto[]> {
        const posts = await this.postRepository.find({where: {account: {id: account.id}}});

        return posts.map(post => ({

            id: post.id,
            postName: post.postName,
            divisionName: post.divisionName,
            parentId: post.parentId,
            product: post.product,
            purpose: post.purpose,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            user: post.user,
            policy: post.policy,
            statistics: post.statistics,
            organization: post.organization
        }))
    }

    async findeOneById(id: string): Promise<PostReadDto | null> {
        const post = await this.postRepository.findOneBy({ id });

        if (!post) return null;
        const postReadDto: PostReadDto = {
            id: post.id,
            postName: post.postName,
            divisionName: post.divisionName,
            parentId: post.parentId,
            product: post.product,
            purpose: post.purpose,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            user: post.user,
            policy: post.policy,
            statistics: post.statistics,
            organization: post.organization
        }

        return postReadDto;
    }

    async create(postCreateDto: PostCreateDto): Promise<Post> {
        const post = new Post();
        post.postName = postCreateDto.postName;
        post.divisionName = postCreateDto.divisionName;
        post.parentId = postCreateDto.parentId,
        post.product = postCreateDto.product,
        post.purpose = postCreateDto.purpose,
        post.user = postCreateDto.user;
        post.organization = postCreateDto.organization;
        post.policy = postCreateDto.policy;

        return await this.postRepository.save(post);
    }
}