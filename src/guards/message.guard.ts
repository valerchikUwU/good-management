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
        const postIdsInConvert = convert.pathOfPosts;
        const userPostsIds = user.posts.map(post => post.id);
        const ifPostSender = userPostsIds.includes(postIdsInConvert[0]);
        const ifPostReciever = userPostsIds.includes(postIdsInConvert[postIdsInConvert.length - 1]);
        const ifPostActive = userPostsIds.includes(convert.activePostId)
        if (ifPostSender || ifPostReciever || ifPostActive) {
            return true;
        }

        throw new ForbiddenException('У вас нет доступа к отправке сообщений!');
    }

}
