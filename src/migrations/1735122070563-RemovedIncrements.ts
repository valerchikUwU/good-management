import { MigrationInterface, QueryRunner } from "typeorm";

export class RemovedIncrements1735122070563 implements MigrationInterface {
    name = 'RemovedIncrements1735122070563'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "projectNumber" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "project_projectNumber_seq"`);
        await queryRunner.query(`ALTER TABLE "strategy" ALTER COLUMN "strategyNumber" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "strategy_strategyNumber_seq"`);
        await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "divisionNumber" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "post_divisionNumber_seq"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "post_divisionNumber_seq" OWNED BY "post"."divisionNumber"`);
        await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "divisionNumber" SET DEFAULT nextval('"post_divisionNumber_seq"')`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "strategy_strategyNumber_seq" OWNED BY "strategy"."strategyNumber"`);
        await queryRunner.query(`ALTER TABLE "strategy" ALTER COLUMN "strategyNumber" SET DEFAULT nextval('"strategy_strategyNumber_seq"')`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "project_projectNumber_seq" OWNED BY "project"."projectNumber"`);
        await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "projectNumber" SET DEFAULT nextval('"project_projectNumber_seq"')`);
    }

}
