import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedPropsToProjectTarget1730301544091 implements MigrationInterface {
    name = 'AddedPropsToProjectTarget1730301544091'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."target_targetstate_enum" AS ENUM('Активная', 'Отменена', 'Завершена')`);
        await queryRunner.query(`ALTER TABLE "target" ADD "targetState" "public"."target_targetstate_enum" NOT NULL DEFAULT 'Активная'`);
        await queryRunner.query(`ALTER TABLE "project" ADD "projectName" character varying(50) NOT NULL DEFAULT 'Название проекта'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "projectName"`);
        await queryRunner.query(`ALTER TABLE "target" DROP COLUMN "targetState"`);
        await queryRunner.query(`DROP TYPE "public"."target_targetstate_enum"`);
    }

}
