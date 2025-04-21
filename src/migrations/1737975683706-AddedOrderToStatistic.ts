import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedOrderToStatistic1737975683706 implements MigrationInterface {
    name = 'AddedOrderToStatistic1737975683706'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "statistic" ADD "orderNumber" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "statistic" DROP COLUMN "orderNumber"`);
    }

}
