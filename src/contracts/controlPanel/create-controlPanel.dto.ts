import { GraphType, PanelType } from "src/domains/controlPanel.entity";
import { Organization } from "src/domains/organization.entity";


/**
 * DTO для создания данных панели управления.
 */
export class ControlPanelCreateDto {
    panelName: string;

    panelType: PanelType;

    graphType: GraphType;

    statisticIds: string[];

    organization: Organization;
}
