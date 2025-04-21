import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedPropToOrganization1740145436258 implements MigrationInterface {
    name = 'AddedPropToOrganization1740145436258'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" ADD "colorCodes" text array`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "colorCodes"`);
    }

}
