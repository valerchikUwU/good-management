import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExtendedTypeAndStateForTarget1730365910432
  implements MigrationInterface
{
  name = 'ExtendedTypeAndStateForTarget1730365910432';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."target_type_enum" RENAME TO "target_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."target_type_enum" AS ENUM('Обычная', 'Статистика', 'Правила', 'Продукт', 'Организационные мероприятия')`,
    );
    await queryRunner.query(
      `ALTER TABLE "target" ALTER COLUMN "type" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "target" ALTER COLUMN "type" TYPE "public"."target_type_enum" USING "type"::"text"::"public"."target_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "target" ALTER COLUMN "type" SET DEFAULT 'Обычная'`,
    );
    await queryRunner.query(`DROP TYPE "public"."target_type_enum_old"`);
    await queryRunner.query(
      `ALTER TYPE "public"."target_targetstate_enum" RENAME TO "target_targetstate_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."target_targetstate_enum" AS ENUM('Активная', 'Отменена', 'Завершена', 'Просрочена')`,
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
      `CREATE TYPE "public"."target_targetstate_enum_old" AS ENUM('Активная', 'Отменена', 'Завершена')`,
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
    await queryRunner.query(
      `CREATE TYPE "public"."target_type_enum_old" AS ENUM('Обычная', 'Статистика', 'Правила', 'Продукт')`,
    );
    await queryRunner.query(
      `ALTER TABLE "target" ALTER COLUMN "type" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "target" ALTER COLUMN "type" TYPE "public"."target_type_enum_old" USING "type"::"text"::"public"."target_type_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "target" ALTER COLUMN "type" SET DEFAULT 'Обычная'`,
    );
    await queryRunner.query(`DROP TYPE "public"."target_type_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."target_type_enum_old" RENAME TO "target_type_enum"`,
    );
  }
}
