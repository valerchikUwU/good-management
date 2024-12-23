import { GraphType, PanelType } from "src/domains/controlPanel.entity";
import { Organization } from "src/domains/organization.entity";
import { PanelToStatistic } from "src/domains/panelToStatistic.entity";


/**
 * DTO для чтения данных панели управления.
 */
export class ControlPanelReadDto {
    id: string;

    panelName: string;

    panelType: PanelType;

    graphType: GraphType;

    createdAt: Date;

    updatedAt: Date;

    panelToStatistics: PanelToStatistic[];

    organization: Organization;
}
