import { MigrationInterface, QueryRunner } from "typeorm";

export class GroupToPosts1744191101177 implements MigrationInterface {
    name = 'GroupToPosts1744191101177'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`);
        await queryRunner.query(`CREATE TABLE "group_to_post" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "postId" uuid, "groupId" uuid, CONSTRAINT "PK_3d3b7b25fb96af76a064e98e5c4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c4f9121b07f10f2cf2f07beee5" ON "group_to_post" ("postId") `);
        await queryRunner.query(`CREATE INDEX "IDX_7d84c384f4967eca67b658c339" ON "group_to_post" ("groupId") `);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "roleId"`);
        await queryRunner.query(`ALTER TABLE "group" ADD "groupAvatarUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "post" ADD "roleId" uuid`);
        await queryRunner.query(`ALTER TABLE "group_to_post" ADD CONSTRAINT "FK_c4f9121b07f10f2cf2f07beee5f" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_to_post" ADD CONSTRAINT "FK_7d84c384f4967eca67b658c339e" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_376552d942487d3c1953ad9304c" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_376552d942487d3c1953ad9304c"`);
        await queryRunner.query(`ALTER TABLE "group_to_post" DROP CONSTRAINT "FK_7d84c384f4967eca67b658c339e"`);
        await queryRunner.query(`ALTER TABLE "group_to_post" DROP CONSTRAINT "FK_c4f9121b07f10f2cf2f07beee5f"`);
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "roleId"`);
        await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "groupAvatarUrl"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "roleId" uuid`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7d84c384f4967eca67b658c339"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c4f9121b07f10f2cf2f07beee5"`);
        await queryRunner.query(`DROP TABLE "group_to_post"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
