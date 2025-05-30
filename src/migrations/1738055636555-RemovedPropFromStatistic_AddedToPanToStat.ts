import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemovedPropFromStatisticAddedToPanToStat1738055636555
  implements MigrationInterface
{
  name = 'RemovedPropFromStatisticAddedToPanToStat1738055636555';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "statistic" DROP COLUMN "orderNumber"`,
    );
    await queryRunner.query(
      `ALTER TABLE "panel_to_statistic" ADD "orderStatisticNumber" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "panel_to_statistic" DROP COLUMN "orderStatisticNumber"`,
    );
    await queryRunner.query(
      `ALTER TABLE "statistic" ADD "orderNumber" integer`,
    );
  }
}
