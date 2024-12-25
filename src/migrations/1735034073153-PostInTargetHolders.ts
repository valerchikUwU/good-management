import { MigrationInterface, QueryRunner } from "typeorm";

export class PostInTargetHolders1735034073153 implements MigrationInterface {
    name = 'PostInTargetHolders1735034073153'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "target_holder" DROP CONSTRAINT "FK_24d8851d99d78fa2b8ff2882b81"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_24d8851d99d78fa2b8ff2882b8"`);
        await queryRunner.query(`ALTER TABLE "target_holder" RENAME COLUMN "userId" TO "postId"`);
        await queryRunner.query(`ALTER TABLE "target" RENAME COLUMN "holderUserId" TO "holderPostId"`);
        await queryRunner.query(`ALTER TABLE "control_panel" ADD "organizationId" uuid`);
        await queryRunner.query(`CREATE INDEX "IDX_fe119993b527196cf2e85fd172" ON "target_holder" ("postId") `);
        await queryRunner.query(`ALTER TABLE "target_holder" ADD CONSTRAINT "FK_fe119993b527196cf2e85fd172b" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "control_panel" ADD CONSTRAINT "FK_07c6f6f716c408b095dde2385b7" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "control_panel" DROP CONSTRAINT "FK_07c6f6f716c408b095dde2385b7"`);
        await queryRunner.query(`ALTER TABLE "target_holder" DROP CONSTRAINT "FK_fe119993b527196cf2e85fd172b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fe119993b527196cf2e85fd172"`);
        await queryRunner.query(`ALTER TABLE "control_panel" DROP COLUMN "organizationId"`);
        await queryRunner.query(`ALTER TABLE "target" RENAME COLUMN "holderPostId" TO "holderUserId"`);
        await queryRunner.query(`ALTER TABLE "target_holder" RENAME COLUMN "postId" TO "userId"`);
        await queryRunner.query(`CREATE INDEX "IDX_24d8851d99d78fa2b8ff2882b8" ON "target_holder" ("userId") `);
        await queryRunner.query(`ALTER TABLE "target_holder" ADD CONSTRAINT "FK_24d8851d99d78fa2b8ff2882b81" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
