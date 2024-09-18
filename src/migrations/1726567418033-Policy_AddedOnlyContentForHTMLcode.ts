import { MigrationInterface, QueryRunner } from "typeorm";

export class PolicyAddedOnlyContentForHTMLcode1726567418033 implements MigrationInterface {
    name = 'PolicyAddedOnlyContentForHTMLcode1726567418033'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "policy" DROP COLUMN "size"`);
        await queryRunner.query(`ALTER TABLE "policy" DROP COLUMN "path"`);
        await queryRunner.query(`ALTER TABLE "policy" DROP COLUMN "mimetype"`);
        await queryRunner.query(`ALTER TABLE "policy" ADD "content" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "policy" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "policy" ADD "mimetype" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "policy" ADD "path" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "policy" ADD "size" integer NOT NULL`);
    }

}
