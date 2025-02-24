import { MigrationInterface, QueryRunner } from "typeorm";

export class HstoreForColors1740408850683 implements MigrationInterface {
    name = 'HstoreForColors1740408850683'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "colorCodes"`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "colorCodes" hstore`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "colorCodes"`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "colorCodes" text array`);
    }

}
