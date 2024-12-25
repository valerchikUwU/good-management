import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Inject,
    Param,
    Post,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Logger } from 'winston';
import { blue, red, green, yellow, bold } from 'colorette';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { OrganizationService } from 'src/application/services/organization/organization.service';
import { ControlPanelService } from 'src/application/services/controlPanel/controlPanel.service';
import { ControlPanelReadDto } from 'src/contracts/controlPanel/read-controlPanel.dto';
import { ControlPanelCreateDto } from 'src/contracts/controlPanel/create-controlPanel.dto';

@ApiTags('ControlPanels')
@ApiBearerAuth('access-token')
@UseGuards(AccessTokenGuard)
@Controller('controlPanels')
export class ControlPanelController {
    constructor(
        private readonly controlPanelService: ControlPanelService,
        private readonly organizationService: OrganizationService,
        @Inject('winston') private readonly logger: Logger,
    ) { }


    @Get(':organizationId')
    @ApiOperation({ summary: 'Все панели в организации' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'ОК!',
        example: [
        ]
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Вы не авторизованы!',
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Ошибка сервера!',
    })
    @ApiParam({
        name: 'organizationId',
        required: true,
        description: 'Id организации',
        example: '2d1cea4c-7cea-4811-8cd5-078da7f20167'
    })
    async findAll(
        @Param('organizationId') organizationId: string
    ): Promise<ControlPanelReadDto[]> {
        const controlPanels = await this.controlPanelService.findAllForOrganization(organizationId);
        return controlPanels;
    }




    @Get(':controlPanelId/controlPanel')
    @ApiOperation({ summary: 'Получить панель по ID' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'ОК!',
        example: {
        }
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Вы не авторизованы!',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: `Панель не найдена!`
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Ошибка сервера!',
    })
    @ApiParam({
        name: 'controlPanelId',
        required: true,
        description: 'Id панели'
    })
    async findOne(@Param('controlPanelId') controlPanelId: string): Promise<ControlPanelReadDto> {
        const controlPanel = await this.controlPanelService.findOneById(controlPanelId)
        return controlPanel;
    }



    @Post('new')
    @ApiOperation({ summary: 'Создать панель управления' })
    @ApiBody({
        description: 'ДТО для создания панели',
        type: ControlPanelCreateDto,
        required: true,
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'ОК!',
        example: { "id": "71ba1ba2-9e53-4238-9bb2-14a475460689" },
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Ошибка валидации!',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Вы не авторизованы!',
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Ошибка сервера!',
    })
    async create(
        @Body() controlPanelCreateDto: ControlPanelCreateDto,
    ): Promise<{ id: string }> {
        const organization = await this.organizationService.findOneById(controlPanelCreateDto.organizationId)
        controlPanelCreateDto.organization = organization;
        const createdControlPanelId = await this.controlPanelService.create(controlPanelCreateDto);
        this.logger.info(
            `${yellow('OK!')} - controlPanelCreateDto: ${JSON.stringify(controlPanelCreateDto)} - Создана новая панель!`,
        );
        return { id: createdControlPanelId };
    }

    // @Patch(':policyDirectoryId/update')
    // @ApiOperation({ summary: 'Обновить папку для политик' })
    // @ApiBody({
    //     description: 'ДТО для обновления папки',
    //     type: PolicyDirectoryUpdateDto,
    //     required: true,
    // })
    // @ApiResponse({
    //     status: HttpStatus.CREATED,
    //     description: 'ОК!',
    //     example: { "id": "71ba1ba2-9e53-4238-9bb2-14a475460689" },
    // })
    // @ApiResponse({
    //     status: HttpStatus.BAD_REQUEST,
    //     description: 'Ошибка валидации!',
    // })
    // @ApiResponse({
    //     status: HttpStatus.UNAUTHORIZED,
    //     description: 'Вы не авторизованы!',
    // })
    // @ApiResponse({
    //     status: HttpStatus.NOT_FOUND,
    //     description: 'Папка не найдена!',
    // })
    // @ApiResponse({
    //     status: HttpStatus.INTERNAL_SERVER_ERROR,
    //     description: 'Ошибка сервера!',
    // })
    // @ApiParam({
    //     name: 'policyDirectoryId',
    //     required: true,
    //     description: 'Id папки',
    //     example: 'a8b9c962-13d7-4b6f-a445-233b51fa6988',
    // })
    // async update(
    //     @Param('policyDirectoryId') policyDirectoryId: string,
    //     @Body() policyDirectoryUpdateDto: PolicyDirectoryUpdateDto,
    // ): Promise<{ id: string }> {
    //     const updatedPolicyDirectoryId = await this.policyDirectoryService.update(
    //         policyDirectoryId,
    //         policyDirectoryUpdateDto,
    //     );
    //     this.logger.info(
    //         `${yellow('OK!')} - UPDATED POLICYDIRECTORY: ${JSON.stringify(policyDirectoryUpdateDto)} - Папка успешно обновлена!`,
    //     );
    //     return { id: updatedPolicyDirectoryId };
    // }

    @Delete(':controlPanelId/remove')
    @ApiOperation({ summary: 'Удалить панель' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'ОК!',
        example: { "message": "Панель успешно удалена!" },
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Вы не авторизованы!',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Панель не найдена!',
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Ошибка сервера!',
    })

    @ApiParam({
        name: 'controlPanelId',
        required: true,
        description: 'Id панели'
    })
    async remove(
        @Param('controlPanelId') controlPanelId: string,
    ) {
        await this.controlPanelService.remove(controlPanelId);
        return { message: "Панель успешно удалена!" }
    }
}
