import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedDivisionNumberToPost1732185466524
  implements MigrationInterface
{
  name = 'AddedDivisionNumberToPost1732185466524';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post" ADD "divisionNumber" SERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ALTER COLUMN "divisionName" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ALTER COLUMN "divisionName" SET DEFAULT 'Подразделения'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post" ALTER COLUMN "divisionName" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ALTER COLUMN "divisionName" DROP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "divisionNumber"`);
  }
}
