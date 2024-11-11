import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedPropToStatisticData1731060255795
  implements MigrationInterface
{
  name = 'AddedPropToStatisticData1731060255795';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "statistic_data" ADD "isCorrelation" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "statistic_data" DROP COLUMN "isCorrelation"`,
    );
  }
}
