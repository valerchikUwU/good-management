import { MigrationInterface, QueryRunner } from 'typeorm';

export class DoubleForStatisticData1747145772205 implements MigrationInterface {
  name = 'DoubleForStatisticData1747145772205';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "statistic_data" DROP COLUMN "value"`);
    await queryRunner.query(
      `ALTER TABLE "statistic_data" ADD "value" numeric NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "statistic_data" DROP COLUMN "value"`);
    await queryRunner.query(
      `ALTER TABLE "statistic_data" ADD "value" integer NOT NULL`,
    );
  }
}
