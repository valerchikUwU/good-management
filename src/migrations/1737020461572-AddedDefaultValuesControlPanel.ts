import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedDefaultValuesControlPanel1737020461572 implements MigrationInterface {
    name = 'AddedDefaultValuesControlPanel1737020461572'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "control_panel" ALTER COLUMN "panelName" SET DEFAULT 'Панель №'`);
        await queryRunner.query(`ALTER TABLE "control_panel" ALTER COLUMN "panelType" SET DEFAULT 'Личная'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "control_panel" ALTER COLUMN "panelType" SET DEFAULT 'Глобальная'`);
        await queryRunner.query(`ALTER TABLE "control_panel" ALTER COLUMN "panelName" DROP DEFAULT`);
    }

}
