import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangedCorrelationType1741346426045 implements MigrationInterface {
  name = 'ChangedCorrelationType1741346426045';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "statistic_data" RENAME COLUMN "isCorrelation" TO "correlationType"`,
    );
    await queryRunner.query(
      `ALTER TABLE "statistic_data" DROP COLUMN "correlationType"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."statistic_data_correlationtype_enum" AS ENUM('Месяц', 'Год')`,
    );
    await queryRunner.query(
      `ALTER TABLE "statistic_data" ADD "correlationType" "public"."statistic_data_correlationtype_enum"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "statistic_data" DROP COLUMN "correlationType"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."statistic_data_correlationtype_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "statistic_data" ADD "correlationType" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "statistic_data" RENAME COLUMN "correlationType" TO "isCorrelation"`,
    );
  }
}
