import { MigrationInterface, QueryRunner } from "typeorm";

export class AttachmentsToTargetsAttachmentsToMessages1738073434531 implements MigrationInterface {
    name = 'AttachmentsToTargetsAttachmentsToMessages1738073434531'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "attachment_to_target" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "attachmentId" uuid, "targetId" uuid, CONSTRAINT "PK_5439fec9d12b0e1cb2b481f9bf1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6aacb469923096e42216b9ba22" ON "attachment_to_target" ("attachmentId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0ebf12db8fd34879e66590fea2" ON "attachment_to_target" ("targetId") `);
        await queryRunner.query(`CREATE TABLE "attachment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "attachmentName" character varying NOT NULL, "attachmentPath" character varying NOT NULL, "attachmentSize" integer NOT NULL, "attachmentMimetype" character varying NOT NULL, "hash" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d2a80c3a8d467f08a750ac4b420" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "attachment_to_message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "attachmentId" uuid, "messageId" uuid, CONSTRAINT "PK_b7ec8eb0d10a38ff3d1a3025f32" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_13f0723c85fbc64fb393065df6" ON "attachment_to_message" ("attachmentId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f816633bad04a76f3a96495ddf" ON "attachment_to_message" ("messageId") `);
        await queryRunner.query(`ALTER TABLE "attachment_to_target" ADD CONSTRAINT "FK_6aacb469923096e42216b9ba22a" FOREIGN KEY ("attachmentId") REFERENCES "attachment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attachment_to_target" ADD CONSTRAINT "FK_0ebf12db8fd34879e66590fea2c" FOREIGN KEY ("targetId") REFERENCES "target"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attachment_to_message" ADD CONSTRAINT "FK_13f0723c85fbc64fb393065df6d" FOREIGN KEY ("attachmentId") REFERENCES "attachment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attachment_to_message" ADD CONSTRAINT "FK_f816633bad04a76f3a96495ddf3" FOREIGN KEY ("messageId") REFERENCES "message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attachment_to_message" DROP CONSTRAINT "FK_f816633bad04a76f3a96495ddf3"`);
        await queryRunner.query(`ALTER TABLE "attachment_to_message" DROP CONSTRAINT "FK_13f0723c85fbc64fb393065df6d"`);
        await queryRunner.query(`ALTER TABLE "attachment_to_target" DROP CONSTRAINT "FK_0ebf12db8fd34879e66590fea2c"`);
        await queryRunner.query(`ALTER TABLE "attachment_to_target" DROP CONSTRAINT "FK_6aacb469923096e42216b9ba22a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f816633bad04a76f3a96495ddf"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_13f0723c85fbc64fb393065df6"`);
        await queryRunner.query(`DROP TABLE "attachment_to_message"`);
        await queryRunner.query(`DROP TABLE "attachment"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0ebf12db8fd34879e66590fea2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6aacb469923096e42216b9ba22"`);
        await queryRunner.query(`DROP TABLE "attachment_to_target"`);
    }

}
