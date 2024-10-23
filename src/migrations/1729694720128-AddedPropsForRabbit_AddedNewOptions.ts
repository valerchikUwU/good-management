import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedPropsForRabbitAddedNewOptions1729694720128 implements MigrationInterface {
    name = 'AddedPropsForRabbitAddedNewOptions1729694720128'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" ADD "tenantId" uuid`);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "UQ_6d5184542539a16abc28d80084e" UNIQUE ("tenantId")`);
        await queryRunner.query(`ALTER TABLE "user" ADD "middleName" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "target" ALTER COLUMN "dateStart" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "statistic_data" ALTER COLUMN "valueDate" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "role_setting" DROP CONSTRAINT "FK_18ed5a2a3c6b45e7cf94fb60b56"`);
        await queryRunner.query(`ALTER TABLE "role_setting" ALTER COLUMN "accountId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_61fb800fdf4d052881ce8b1da29"`);
        await queryRunner.query(`ALTER TABLE "message" ALTER COLUMN "convertId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "firstName" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "lastName" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_6758e6c1db84e6f7e711f8021f5" UNIQUE ("telegramId")`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "telegramId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "telephoneNumber"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "telephoneNumber" character varying(13)`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_e8c530fb84a619fbff9941f31bb" UNIQUE ("telephoneNumber")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_da15f54aece694d1bf99b27d511" UNIQUE ("vk_id")`);
        await queryRunner.query(`ALTER TABLE "role_setting" ADD CONSTRAINT "FK_18ed5a2a3c6b45e7cf94fb60b56" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_61fb800fdf4d052881ce8b1da29" FOREIGN KEY ("convertId") REFERENCES "convert"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_61fb800fdf4d052881ce8b1da29"`);
        await queryRunner.query(`ALTER TABLE "role_setting" DROP CONSTRAINT "FK_18ed5a2a3c6b45e7cf94fb60b56"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_da15f54aece694d1bf99b27d511"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_e8c530fb84a619fbff9941f31bb"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "telephoneNumber"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "telephoneNumber" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "telegramId" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_6758e6c1db84e6f7e711f8021f5"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "lastName" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "firstName" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "message" ALTER COLUMN "convertId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_61fb800fdf4d052881ce8b1da29" FOREIGN KEY ("convertId") REFERENCES "convert"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_setting" ALTER COLUMN "accountId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "role_setting" ADD CONSTRAINT "FK_18ed5a2a3c6b45e7cf94fb60b56" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "statistic_data" ALTER COLUMN "valueDate" SET DEFAULT '2024-10-21 13:10:33.411'`);
        await queryRunner.query(`ALTER TABLE "target" ALTER COLUMN "dateStart" SET DEFAULT '2024-10-21 13:10:33.405'`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "middleName"`);
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "UQ_6d5184542539a16abc28d80084e"`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "tenantId"`);
    }

}
