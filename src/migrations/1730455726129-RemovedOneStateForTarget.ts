import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemovedOneStateForTarget1730455726129
  implements MigrationInterface
{
  name = 'RemovedOneStateForTarget1730455726129';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."target_targetstate_enum" RENAME TO "target_targetstate_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."target_targetstate_enum" AS ENUM('Активная', 'Отменена', 'Завершена')`,
    );
    await queryRunner.query(
      `ALTER TABLE "target" ALTER COLUMN "targetState" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "target" ALTER COLUMN "targetState" TYPE "public"."target_targetstate_enum" USING "targetState"::"text"::"public"."target_targetstate_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "target" ALTER COLUMN "targetState" SET DEFAULT 'Активная'`,
    );
    await queryRunner.query(`DROP TYPE "public"."target_targetstate_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."target_targetstate_enum_old" AS ENUM('Активная', 'Отменена', 'Завершена', 'Просрочена')`,
    );
    await queryRunner.query(
      `ALTER TABLE "target" ALTER COLUMN "targetState" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "target" ALTER COLUMN "targetState" TYPE "public"."target_targetstate_enum_old" USING "targetState"::"text"::"public"."target_targetstate_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "target" ALTER COLUMN "targetState" SET DEFAULT 'Активная'`,
    );
    await queryRunner.query(`DROP TYPE "public"."target_targetstate_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."target_targetstate_enum_old" RENAME TO "target_targetstate_enum"`,
    );
  }
}
