import { MigrationInterface, QueryRunner } from "typeorm";

export class PostsToPolicy1732194027485 implements MigrationInterface {
    name = 'PostsToPolicy1732194027485'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_f3517008f0c70943e789681270b"`);
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "UQ_f3517008f0c70943e789681270b"`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_f3517008f0c70943e789681270b" FOREIGN KEY ("policyId") REFERENCES "policy"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_f3517008f0c70943e789681270b"`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "UQ_f3517008f0c70943e789681270b" UNIQUE ("policyId")`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_f3517008f0c70943e789681270b" FOREIGN KEY ("policyId") REFERENCES "policy"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
