import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConvertService } from "src/application/services/convert/convert.service";
import { ReadUserDto } from "src/contracts/user/read-user.dto";

@Injectable()
export class MessagesGuard implements CanActivate {
    constructor(
        private readonly convertService: ConvertService,
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user as ReadUserDto;
        const convertId = request.params.convertId;
        if (!convertId) {
            throw new BadRequestException('Не передан ID конверта');
        }  
        const convert = await this.convertService.findOneById(convertId, [
            'convertToPosts.post.user',
            'host.user',
        ]);

        // Получаем ID пользователей в конверте
        const userIdsInConvert = convert.convertToPosts.map(convertToPost => convertToPost.post.user.id);

        // Проверяем, является ли пользователь владельцем или наблюдателем

        if (userIdsInConvert.includes(user.id)) {
            return true;
        }

        throw new ForbiddenException('У вас нет доступа к отправке сообщений!');
    }

}
