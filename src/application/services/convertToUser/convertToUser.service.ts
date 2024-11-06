import { Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Logger } from "winston";
import { ConvertToUser } from "src/domains/convertToUser.entity";
import { ConvertToUserRepository } from "./repository/convertToUser.repository";
import { Convert } from "src/domains/convert.entity";
import { UsersService } from "../users/users.service";
import { ConvertReadDto } from "src/contracts/convert/read-convert.dto";
// import { ConvertToUserCreateDto } from "src/contracts/convertToUser/create-convertToUser.dto";


@Injectable()
export class ConvertToUserService{
    constructor(
        @InjectRepository(ConvertToUser)
        private readonly convertToUserRepository: ConvertToUserRepository,
        private readonly userService: UsersService,
        @Inject('winston') private readonly logger: Logger
    )
    {}

    async createSeveral(convert: Convert, userIds: string[]): Promise<ConvertToUser[]> {
        const createdRelations: ConvertToUser[] = [];
    
        for (const userId of userIds) {
            try {
                const user = await this.userService.findOne(userId);
                if (!user) {
                    throw new NotFoundException(`User not found with id ${userId}`);
                }
    
                const convertToUser = new ConvertToUser();
                convertToUser.user = user;
                convertToUser.convert = convert;
    
                const savedRelation = await this.convertToUserRepository.save(convertToUser);
                createdRelations.push(savedRelation);
            } catch (err) {
                this.logger.error(err);
                if(err instanceof NotFoundException){
                    throw err;
                }

                throw new InternalServerErrorException('Ой, что - то пошло не так при добавлении участников к чату!')
                // Здесь можно добавить логику для обработки ошибок, например, откат транзакции
            }
        }
    
        return createdRelations;
    }

    async remove(convert: ConvertReadDto): Promise<void>{
        await this.convertToUserRepository.delete({convert: convert});
    }
    

}



// async createSeveral(convert: Convert, convertToUserCreateDtos: ConvertToUserCreateDto[]): Promise<string[]> {
//     const createdRelations: string[] = [];

//     for (const convertToUserCreateDto of convertToUserCreateDtos) {
//         try {
//             const user = await this.userService.findOne(convertToUserCreateDto.userId);
//             if (!user) {
//                 throw new NotFoundException(`User not found with id ${convertToUserCreateDto.userId}`);
//             }

//             const convertToUser = new ConvertToUser();
//             convertToUser.user = user;
//             convertToUser.convert = convert;

//             const savedRelationId = await this.convertToUserRepository.insert(convertToUser);
//             createdRelations.push(savedRelationId.identifiers[0].id);
//         } catch (err) {
//             this.logger.error(err);
//             if(err instanceof NotFoundException){
//                 throw err;
//             }

//             throw new InternalServerErrorException('Ой, что - то пошло не так при добавлении участников к чату!')
//             // Здесь можно добавить логику для обработки ошибок, например, откат транзакции
//         }
//     }

//     return createdRelations;
// }