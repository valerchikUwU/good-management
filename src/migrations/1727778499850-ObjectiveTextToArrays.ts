import { MigrationInterface, QueryRunner } from "typeorm";

export class ObjectiveTextToArrays1727778499850 implements MigrationInterface {
    name = 'ObjectiveTextToArrays1727778499850'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "objective" DROP COLUMN "orderNumber"`);
        await queryRunner.query(`ALTER TABLE "objective" DROP COLUMN "situation"`);
        await queryRunner.query(`ALTER TABLE "objective" ADD "situation" text array NOT NULL`);
        await queryRunner.query(`ALTER TABLE "objective" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "objective" ADD "content" text array NOT NULL`);
        await queryRunner.query(`ALTER TABLE "objective" DROP COLUMN "rootCause"`);
        await queryRunner.query(`ALTER TABLE "objective" ADD "rootCause" text array NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "objective" DROP COLUMN "rootCause"`);
        await queryRunner.query(`ALTER TABLE "objective" ADD "rootCause" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "objective" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "objective" ADD "content" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "objective" DROP COLUMN "situation"`);
        await queryRunner.query(`ALTER TABLE "objective" ADD "situation" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "objective" ADD "orderNumber" integer NOT NULL`);
    }

}
