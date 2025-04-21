import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedPropToAttachmentConvertDeadline1742896839367 implements MigrationInterface {
    name = 'AddedPropToAttachmentConvertDeadline1742896839367'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_24115eb24ec160fa1a07adbdbe"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_88fc2f96827f4d58ff1e86d653"`);
        await queryRunner.query(`ALTER TABLE "convert" DROP COLUMN "expirationTime"`);
        await queryRunner.query(`ALTER TABLE "attachment" ADD "originalName" character varying NOT NULL DEFAULT 'OriginalName'`);
        await queryRunner.query(`ALTER TABLE "convert" ADD "dateStart" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "convert" ADD "deadline" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "convert_to_post" ADD CONSTRAINT "UQ_ab65d4f74f77c0a2fef3c282075" UNIQUE ("postId", "convertId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "convert_to_post" DROP CONSTRAINT "UQ_ab65d4f74f77c0a2fef3c282075"`);
        await queryRunner.query(`ALTER TABLE "convert" DROP COLUMN "deadline"`);
        await queryRunner.query(`ALTER TABLE "convert" DROP COLUMN "dateStart"`);
        await queryRunner.query(`ALTER TABLE "attachment" DROP COLUMN "originalName"`);
        await queryRunner.query(`ALTER TABLE "convert" ADD "expirationTime" integer NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_88fc2f96827f4d58ff1e86d653" ON "convert_to_post" ("convertId") `);
        await queryRunner.query(`CREATE INDEX "IDX_24115eb24ec160fa1a07adbdbe" ON "convert_to_post" ("postId") `);
    }

}
