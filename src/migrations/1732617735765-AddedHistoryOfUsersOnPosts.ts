import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedHistoryOfUsersOnPosts1732617735765 implements MigrationInterface {
    name = 'AddedHistoryOfUsersOnPosts1732617735765'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "history_users_to_post" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "postId" uuid, "userId" uuid, CONSTRAINT "PK_b7b268cb7fe524cdce6ad47264f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f2d3568f244296ce211306dd24" ON "history_users_to_post" ("postId") `);
        await queryRunner.query(`ALTER TABLE "history_users_to_post" ADD CONSTRAINT "FK_f2d3568f244296ce211306dd244" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "history_users_to_post" ADD CONSTRAINT "FK_7541e4a4eb8305af0fc44012bed" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "history_users_to_post" DROP CONSTRAINT "FK_7541e4a4eb8305af0fc44012bed"`);
        await queryRunner.query(`ALTER TABLE "history_users_to_post" DROP CONSTRAINT "FK_f2d3568f244296ce211306dd244"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f2d3568f244296ce211306dd24"`);
        await queryRunner.query(`DROP TABLE "history_users_to_post"`);
    }

}
