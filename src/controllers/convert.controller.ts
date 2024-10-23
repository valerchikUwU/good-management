import { Body, Controller, Get, HttpStatus, Inject, Ip, Param, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ConvertService } from "src/application/services/convert/convert.service";
import { UsersService } from "src/application/services/users/users.service";
import { ConvertCreateDto } from "src/contracts/convert/create-convert.dto";
import { ConvertReadDto } from "src/contracts/convert/read-convert.dto";
import { Logger } from "winston";
import { blue, red, green, yellow, bold } from 'colorette';


@ApiTags('Converts')
@Controller(':userId/converts')
export class ConvertController{
    constructor(
        private readonly convertService: ConvertService,
        private readonly userService: UsersService,
        @Inject('winston') private readonly logger: Logger,
    ){

    }


    @Get()
    @ApiOperation({ summary: 'Все чаты' })
    @ApiResponse({
        status: HttpStatus.OK, description: "ОК!",
        example: [
            {
              id: "222f1a02-d053-4885-99b6-f353eb277b6f",
              convertTheme: "Тема",
              expirationTime: "хз как еще реализовать",
              dateFinish: "2024-09-26T13:03:19.759Z",
              createdAt: "2024-10-21T13:10:51.781Z"
            }
          ]

    })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
    @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
    async findAll(@Param('userId') userId: string): Promise<ConvertReadDto[]>{
        const user = await this.userService.findOne(userId);
        const converts = await this.convertService.findAll(user.account);
        return converts;
    }


    @Get(':convertId')
    @ApiOperation({ summary: 'Чат по id' })
    @ApiResponse({
        status: HttpStatus.OK, description: "ОК!",
        example: {}

    })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
    @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
    async findOne(@Param('convertId') convertId: string, @Ip() ip: string): Promise<ConvertReadDto>{
        const convert = await this.convertService.findOneById(convertId);
        return convert;
    }

    @Post('new')
    @ApiOperation({ summary: 'Создать чат' })
    @ApiBody({
        description: 'ДТО для создания чата',
        type: ConvertCreateDto,
        required: true,
    })
    @ApiResponse({
        status: HttpStatus.OK, description: "ОК!",
        example: {}

    })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Ошибка сервера!" })
    @ApiParam({ name: 'userId', required: true, description: 'Id пользователя', example: '3b809c42-2824-46c1-9686-dd666403402a' })
    async create(@Param('userId') userId: string, @Body() convertCreateDto: ConvertCreateDto, @Ip() ip: string): Promise<ConvertReadDto>{
        const user = await this.userService.findOne(userId);
        convertCreateDto.host = user;
        convertCreateDto.account = user.account;
        const createdConvert = await this.convertService.create(convertCreateDto);
        this.logger.info(`${yellow('OK!')} - ${red(ip)} - convertCreateDto: ${JSON.stringify(convertCreateDto)} - Создан новый чат!`)
        return createdConvert;
    }
}