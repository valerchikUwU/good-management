import { Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Logger } from "winston";
import { PanelToStatisticRepository } from "./repository/panelToStatistic.repository";
import { ControlPanelService } from "../controlPanel/controlPanel.service";
import { ControlPanel } from "src/domains/controlPanel.entity";
import { PanelToStatistic } from "src/domains/panelToStatistic.entity";
import { StatisticService } from "../statistic/statistic.service";
import { ControlPanelReadDto } from "src/contracts/controlPanel/read-controlPanel.dto";


@Injectable()
export class PanelToStatisticService{
    constructor(
        @InjectRepository(PanelToStatisticRepository)
        private readonly panelToStatisticRepository: PanelToStatisticRepository,
        private readonly statisticService: StatisticService,
        @Inject('winston') private readonly logger: Logger
    )
    {}

  async createSeveral(
    controlPanel: ControlPanel,
    statisticIds: string[],
  ): Promise<void> {
    try {

      const statistics = await this.statisticService.findBulk(statisticIds);

      // Создаём связи для всех найденных Policy
      const panelToStatistics = statistics.map(statistic => {
        const panelToStatistic = new PanelToStatistic();
        panelToStatistic.controlPanel = controlPanel;
        panelToStatistic.statistic = statistic;
        return panelToStatistic;
      });
      await this.panelToStatisticRepository.insert(panelToStatistics)
    }
    catch (err) {
      this.logger.error(err);
    }

  }

    async remove(controlPanel: ControlPanelReadDto): Promise<void>{
        await this.panelToStatisticRepository.delete({controlPanel: controlPanel});
    }
    

}