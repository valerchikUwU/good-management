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
        const convert = await this.convertService.findOneById(convertId);
        const userPostsIds = user.posts.map(post => post.id);
        const isConvertFinished = convert.convertStatus;
        const ifPostSender = userPostsIds.includes(convert.pathOfPosts[0]);
        const ifPostReciever = userPostsIds.includes(convert.pathOfPosts[convert.pathOfPosts.length - 1]);
        const ifPostActive = userPostsIds.includes(convert.activePostId)
        if ((ifPostSender || ifPostReciever || ifPostActive) && isConvertFinished) {
            return true;
        }

        throw new ForbiddenException('У вас нет доступа к отправке сообщений!');
    }

}
