import { MigrationInterface, QueryRunner } from "typeorm";

export class TargHoldersToTarget1727439864958 implements MigrationInterface {
    name = 'TargHoldersToTarget1727439864958'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "target_holder" DROP CONSTRAINT "FK_b5b7a1399bb79f0a6f817e26297"`);
        await queryRunner.query(`ALTER TABLE "target_holder" DROP CONSTRAINT "REL_b5b7a1399bb79f0a6f817e2629"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_103fed7f0b4ddb923bb1b11172" ON "target_holder" ("targetId", "userId") `);
        await queryRunner.query(`ALTER TABLE "target_holder" ADD CONSTRAINT "FK_b5b7a1399bb79f0a6f817e26297" FOREIGN KEY ("targetId") REFERENCES "target"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "target_holder" DROP CONSTRAINT "FK_b5b7a1399bb79f0a6f817e26297"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_103fed7f0b4ddb923bb1b11172"`);
        await queryRunner.query(`ALTER TABLE "target_holder" ADD CONSTRAINT "REL_b5b7a1399bb79f0a6f817e2629" UNIQUE ("targetId")`);
        await queryRunner.query(`ALTER TABLE "target_holder" ADD CONSTRAINT "FK_b5b7a1399bb79f0a6f817e26297" FOREIGN KEY ("targetId") REFERENCES "target"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
