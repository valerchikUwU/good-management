import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedTimestampsToPolicyDirectories1734617094401 implements MigrationInterface {
    name = 'AddedTimestampsToPolicyDirectories1734617094401'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "policy_directory" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "policy_directory" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "projectName" SET DEFAULT 'Проект'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "projectName" SET DEFAULT 'Название проекта'`);
        await queryRunner.query(`ALTER TABLE "policy_directory" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "policy_directory" DROP COLUMN "createdAt"`);
    }

}
