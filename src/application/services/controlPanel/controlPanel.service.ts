import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Logger } from 'winston';
import { IsNull } from "typeorm";
import { ControlPanel } from "src/domains/controlPanel.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { ControlPanelRepository } from "./repository/controlPanel.repository";
import { PanelToStatisticService } from "../panelToStatistic/panelToStatistic.service";
import { ControlPanelReadDto } from "src/contracts/controlPanel/read-controlPanel.dto";
import { ControlPanelCreateDto } from "src/contracts/controlPanel/create-controlPanel.dto";



@Injectable()
export class ControlPanelService {
    constructor(
        @InjectRepository(ControlPanel)
        private readonly controlPanelRepository: ControlPanelRepository,
        private readonly panelToStatisticService: PanelToStatisticService,
        @Inject('winston') private readonly logger: Logger,
    ) {

    }

    async findAllForOrganization(organizationId: string): Promise<ControlPanelReadDto[]> {
        try {
            const controlPanels = await this.controlPanelRepository.find({ where: { organization: { id: organizationId } } });

            return controlPanels.map(controlPanel => ({
                id: controlPanel.id,
                panelName: controlPanel.panelName,
                panelType: controlPanel.panelType,
                graphType: controlPanel.graphType,
                createdAt: controlPanel.createdAt,
                updatedAt: controlPanel.updatedAt,
                panelToStatistics: controlPanel.panelToStatistics,
                organization: controlPanel.organization
            }))
        }
        catch (err) {

            this.logger.error(err);
            // Обработка других ошибок
            throw new InternalServerErrorException('Ошибка при получении всех политик!');
        }
    }


    async findOneById(id: string): Promise<ControlPanelReadDto> {
        try {
            const controlPanel = await this.controlPanelRepository.findOne({ where: { id }, relations: ['panelToStatistic.statistic'] });
            if (!controlPanel) throw new NotFoundException(`Панель управления с ID: ${id} не найдена`);
            const controlPanelReadDto: ControlPanelReadDto = {
                id: controlPanel.id,
                panelName: controlPanel.panelName,
                panelType: controlPanel.panelType,
                graphType: controlPanel.graphType,
                createdAt: controlPanel.createdAt,
                updatedAt: controlPanel.updatedAt,
                panelToStatistics: controlPanel.panelToStatistics,
                organization: controlPanel.organization
            }

            return controlPanelReadDto;
        }
        catch (err) {

            this.logger.error(err);
            // Обработка специфичных исключений
            if (err instanceof NotFoundException) {
                throw err; // Пробрасываем исключение дальше
            }

            // Обработка других ошибок
            throw new InternalServerErrorException('Ошибка при получении панели управленияв');
        }

    }

    async create(controlPanelCreateDto: ControlPanelCreateDto): Promise<string> {
        try {
            const controlPanel = new ControlPanel();
            controlPanel.panelName = controlPanelCreateDto.panelName;
            controlPanel.panelType = controlPanelCreateDto.panelType;
            controlPanel.graphType = controlPanelCreateDto.graphType;
            controlPanel.organization = controlPanelCreateDto.organization;
            const createdControlPanel = await this.controlPanelRepository.save(controlPanel);
            await this.panelToStatisticService.createSeveral(createdControlPanel, controlPanelCreateDto.statisticIds);

            return createdControlPanel.id
        }
        catch (err) {
            this.logger.error(err);
            // Обработка специфичных исключений
            if (err instanceof BadRequestException) {
                throw err; // Пробрасываем исключение дальше
            }
            throw new InternalServerErrorException('Ошибка при создании панели управления')
        }
    }


    // async update(_id: string, updatePolicyDto: PolicyUpdateDto): Promise<string> {
    //     try {
    //         const policy = await this.policyRepository.findOne({ where: { id: _id } });
    //         if (!policy) {
    //             throw new NotFoundException(`Политика с ID ${_id} не найдена`);
    //         }
    //         // Обновить свойства, если они указаны в DTO
    //         if (updatePolicyDto.policyName) policy.policyName = updatePolicyDto.policyName;
    //         if (updatePolicyDto.state) policy.state = updatePolicyDto.state;
    //         if (updatePolicyDto.type) policy.type = updatePolicyDto.type;
    //         if (updatePolicyDto.content) policy.content = updatePolicyDto.content;
    //         if (updatePolicyDto.state === State.ACTIVE) policy.dateActive = new Date();

    //         if (updatePolicyDto.policyToOrganizations) {
    //             await this.policyToOrganizationService.remove(policy);
    //             await this.policyToOrganizationService.createSeveral(policy, updatePolicyDto.policyToOrganizations);
    //         }
    //         await this.policyRepository.update(policy.id, { policyName: policy.policyName, state: policy.state, type: policy.type, content: policy.content, dateActive: policy.dateActive });
    //         return policy.id
    //     }
    //     catch (err) {

    //         this.logger.error(err);
    //         // Обработка специфичных исключений
    //         if (err instanceof NotFoundException) {
    //             throw err; // Пробрасываем исключение дальше
    //         }

    //         // Обработка других ошибок
    //         throw new InternalServerErrorException('Ошибка при обновлении политики');
    //     }

    // }



    async remove(_id: string): Promise<void> {
        try {
            const controlPanel = await this.controlPanelRepository.findOne({
                where: { id: _id },
            });
            if (!controlPanel) {
                throw new NotFoundException(`Панель с ID ${_id} не найдена`);
            }

            await this.panelToStatisticService.remove(controlPanel);
            await this.controlPanelRepository.delete({ id: _id });
        }
        catch (err) {

            this.logger.error(err);
            // Обработка специфичных исключений
            if (err instanceof NotFoundException) {
                throw err; // Пробрасываем исключение дальше
            }
            throw new InternalServerErrorException('Ошибка при удалении панели управления')
        }

    }
}