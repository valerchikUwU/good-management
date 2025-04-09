import { MigrationInterface, QueryRunner } from "typeorm";

export class RenamedEnumsForTarget1744210552514 implements MigrationInterface {
    name = 'RenamedEnumsForTarget1744210552514'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."target_type_enum" RENAME TO "target_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."target_type_enum" AS ENUM('Задача', 'Метрика', 'Правила', 'Продукт', 'Организационные мероприятия', 'Приказ', 'Личная')`);
        await queryRunner.query(`ALTER TABLE "target" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "target" ALTER COLUMN "type" TYPE "public"."target_type_enum" USING "type"::"text"::"public"."target_type_enum"`);
        await queryRunner.query(`ALTER TABLE "target" ALTER COLUMN "type" SET DEFAULT 'Задача'`);
        await queryRunner.query(`DROP TYPE "public"."target_type_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."target_targetstate_enum" RENAME TO "target_targetstate_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."target_targetstate_enum" AS ENUM('Черновик', 'Активная', 'Отменена', 'Завершена')`);
        await queryRunner.query(`ALTER TABLE "target" ALTER COLUMN "targetState" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "target" ALTER COLUMN "targetState" TYPE "public"."target_targetstate_enum" USING "targetState"::"text"::"public"."target_targetstate_enum"`);
        await queryRunner.query(`ALTER TABLE "target" ALTER COLUMN "targetState" SET DEFAULT 'Черновик'`);
        await queryRunner.query(`DROP TYPE "public"."target_targetstate_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."target_targetstate_enum_old" AS ENUM('Активная', 'Завершена', 'Отменена')`);
        await queryRunner.query(`ALTER TABLE "target" ALTER COLUMN "targetState" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "target" ALTER COLUMN "targetState" TYPE "public"."target_targetstate_enum_old" USING "targetState"::"text"::"public"."target_targetstate_enum_old"`);
        await queryRunner.query(`ALTER TABLE "target" ALTER COLUMN "targetState" SET DEFAULT 'Активная'`);
        await queryRunner.query(`DROP TYPE "public"."target_targetstate_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."target_targetstate_enum_old" RENAME TO "target_targetstate_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."target_type_enum_old" AS ENUM('Личная', 'Обычная', 'Организационные мероприятия', 'Правила', 'Приказ', 'Продукт', 'Статистика')`);
        await queryRunner.query(`ALTER TABLE "target" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "target" ALTER COLUMN "type" TYPE "public"."target_type_enum_old" USING "type"::"text"::"public"."target_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "target" ALTER COLUMN "type" SET DEFAULT 'Обычная'`);
        await queryRunner.query(`DROP TYPE "public"."target_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."target_type_enum_old" RENAME TO "target_type_enum"`);
    }

}
