import { MigrationInterface, QueryRunner } from 'typeorm';

export class StatisticsToAccount1727353609630 implements MigrationInterface {
  name = 'StatisticsToAccount1727353609630';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "statistic" ADD "accountId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "statistic_data" DROP CONSTRAINT "FK_c511c5355fc7b012b7ee2097325"`,
    );
    await queryRunner.query(
      `ALTER TABLE "statistic_data" DROP CONSTRAINT "REL_c511c5355fc7b012b7ee209732"`,
    );
    await queryRunner.query(
      `ALTER TABLE "statistic_data" ADD CONSTRAINT "FK_c511c5355fc7b012b7ee2097325" FOREIGN KEY ("statisticId") REFERENCES "statistic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "statistic" ADD CONSTRAINT "FK_9c52f0fb9f943fef30e7d0b7a24" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "statistic" DROP CONSTRAINT "FK_9c52f0fb9f943fef30e7d0b7a24"`,
    );
    await queryRunner.query(
      `ALTER TABLE "statistic_data" DROP CONSTRAINT "FK_c511c5355fc7b012b7ee2097325"`,
    );
    await queryRunner.query(
      `ALTER TABLE "statistic_data" ADD CONSTRAINT "REL_c511c5355fc7b012b7ee209732" UNIQUE ("statisticId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "statistic_data" ADD CONSTRAINT "FK_c511c5355fc7b012b7ee2097325" FOREIGN KEY ("statisticId") REFERENCES "statistic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "statistic" DROP COLUMN "accountId"`);
  }
}
