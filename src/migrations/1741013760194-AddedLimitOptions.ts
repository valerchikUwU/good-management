import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedLimitOptions1741013760194 implements MigrationInterface {
    name = 'AddedLimitOptions1741013760194'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "convert" DROP COLUMN "convertTheme"`);
        await queryRunner.query(`ALTER TABLE "convert" ADD "convertTheme" character varying(1024) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "attachment" DROP COLUMN "attachmentName"`);
        await queryRunner.query(`ALTER TABLE "attachment" ADD "attachmentName" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "control_panel" DROP COLUMN "panelName"`);
        await queryRunner.query(`ALTER TABLE "control_panel" ADD "panelName" character varying(255) NOT NULL DEFAULT 'Панель №'`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "accountName"`);
        await queryRunner.query(`ALTER TABLE "account" ADD "accountName" character varying(120) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "fileName"`);
        await queryRunner.query(`ALTER TABLE "file" ADD "fileName" character varying(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "fileName"`);
        await queryRunner.query(`ALTER TABLE "file" ADD "fileName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "accountName"`);
        await queryRunner.query(`ALTER TABLE "account" ADD "accountName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "control_panel" DROP COLUMN "panelName"`);
        await queryRunner.query(`ALTER TABLE "control_panel" ADD "panelName" character varying NOT NULL DEFAULT 'Панель №'`);
        await queryRunner.query(`ALTER TABLE "attachment" DROP COLUMN "attachmentName"`);
        await queryRunner.query(`ALTER TABLE "attachment" ADD "attachmentName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "convert" DROP COLUMN "convertTheme"`);
        await queryRunner.query(`ALTER TABLE "convert" ADD "convertTheme" character varying NOT NULL`);
    }

}
