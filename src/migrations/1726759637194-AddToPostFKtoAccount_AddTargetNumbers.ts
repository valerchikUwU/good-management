import { MigrationInterface, QueryRunner } from "typeorm";

export class AddToPostFKtoAccountAddTargetNumbers1726759637194 implements MigrationInterface {
    name = 'AddToPostFKtoAccountAddTargetNumbers1726759637194'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "target" DROP COLUMN "orderNumber"`);
        await queryRunner.query(`ALTER TABLE "target" ADD "commonNumber" integer`);
        await queryRunner.query(`ALTER TABLE "target" ADD "statisticNumber" integer`);
        await queryRunner.query(`ALTER TABLE "target" ADD "ruleNumber" integer`);
        await queryRunner.query(`ALTER TABLE "target" ADD "productNumber" integer`);
        await queryRunner.query(`ALTER TABLE "project" ADD "projectNumber" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "post" ADD "accountId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "target" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_f219a87fd8c020d3bb6527c9420" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_f219a87fd8c020d3bb6527c9420"`);
        await queryRunner.query(`ALTER TABLE "target" ALTER COLUMN "type" SET DEFAULT 'Обычная'`);
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "accountId"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "projectNumber"`);
        await queryRunner.query(`ALTER TABLE "target" DROP COLUMN "productNumber"`);
        await queryRunner.query(`ALTER TABLE "target" DROP COLUMN "ruleNumber"`);
        await queryRunner.query(`ALTER TABLE "target" DROP COLUMN "statisticNumber"`);
        await queryRunner.query(`ALTER TABLE "target" DROP COLUMN "commonNumber"`);
        await queryRunner.query(`ALTER TABLE "target" ADD "orderNumber" integer NOT NULL DEFAULT '1'`);
    }

}
