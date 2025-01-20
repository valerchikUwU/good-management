import { MigrationInterface, QueryRunner } from "typeorm";

export class TargetsToPolicy1737127780801 implements MigrationInterface {
    name = 'TargetsToPolicy1737127780801'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "target" ADD "policyId" uuid`);
        await queryRunner.query(`CREATE INDEX "IDX_1e4be9fdeee9449f164f5dc44b" ON "target" ("policyId") `);
        await queryRunner.query(`ALTER TABLE "target" ADD CONSTRAINT "FK_1e4be9fdeee9449f164f5dc44b4" FOREIGN KEY ("policyId") REFERENCES "policy"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "target" DROP CONSTRAINT "FK_1e4be9fdeee9449f164f5dc44b4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1e4be9fdeee9449f164f5dc44b"`);
        await queryRunner.query(`ALTER TABLE "target" DROP COLUMN "policyId"`);
    }

}
