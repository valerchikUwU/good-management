import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedReportDayToOrganization1730906158062 implements MigrationInterface {
    name = 'AddedReportDayToOrganization1730906158062'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."organization_reportday_enum" AS ENUM('1', '2', '3', '4', '5', '6', '0')`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "reportDay" "public"."organization_reportday_enum" NOT NULL DEFAULT '5'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "reportDay"`);
        await queryRunner.query(`DROP TYPE "public"."organization_reportday_enum"`);
    }

}
