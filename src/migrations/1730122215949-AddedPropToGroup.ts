import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedPropToGroup1730122215949 implements MigrationInterface {
    name = 'AddedPropToGroup1730122215949'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group" ADD "groupDivisionName" character varying(50)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "groupDivisionName"`);
    }

}
