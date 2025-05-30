import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedCascadesFromUserToPost1747057579449
  implements MigrationInterface
{
  name = 'AddedCascadesFromUserToPost1747057579449';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "strategy" DROP CONSTRAINT "FK_c1c10ab196af1494177a8b08fc9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_7c4b0d3b77eaf26f8b4da879e63"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" DROP CONSTRAINT "message_convertId_fkey"`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachment_to_message" DROP CONSTRAINT "attachment_to_message_messageId_fkey"`,
    );
    await queryRunner.query(
      `ALTER TABLE "target" DROP CONSTRAINT "target_convertId_fkey"`,
    );
    await queryRunner.query(
      `ALTER TABLE "policy" DROP CONSTRAINT "FK_4715ad2cc885456187d2e0775f9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "statistic_data" DROP CONSTRAINT "statistic_data_statisticId_fkey"`,
    );
    await queryRunner.query(
      `ALTER TABLE "history_users_to_post" DROP CONSTRAINT "history_users_to_post_postId_fkey"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convert_to_post" DROP CONSTRAINT "convert_to_post_convertId_fkey"`,
    );
    await queryRunner.query(
      `ALTER TABLE "goal" DROP CONSTRAINT "FK_40bd308ea814964cec7146c6dce"`,
    );
    await queryRunner.query(
      `ALTER TABLE "strategy" RENAME COLUMN "userId" TO "postCreatorId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" RENAME COLUMN "userId" TO "postCreatorId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "goal" RENAME COLUMN "userId" TO "postCreatorId"`,
    );
    await queryRunner.query(`ALTER TABLE "policy" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "policy" ADD "deadline" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "policy" ADD "postCreatorId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ADD "isDefault" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."policy_type_enum" RENAME TO "policy_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."policy_type_enum" AS ENUM('Директива', 'Инструкция', 'Распоряжение')`,
    );
    await queryRunner.query(
      `ALTER TABLE "policy" ALTER COLUMN "type" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "policy" ALTER COLUMN "type" TYPE "public"."policy_type_enum" USING "type"::"text"::"public"."policy_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "policy" ALTER COLUMN "type" SET DEFAULT 'Директива'`,
    );
    await queryRunner.query(`DROP TYPE "public"."policy_type_enum_old"`);
    await queryRunner.query(
      `ALTER TABLE "strategy" ADD CONSTRAINT "FK_8149a5eda5dca7f0700fc5f0894" FOREIGN KEY ("postCreatorId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_95a0d2db82890455f82840563ba" FOREIGN KEY ("postCreatorId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "FK_61fb800fdf4d052881ce8b1da29" FOREIGN KEY ("convertId") REFERENCES "convert"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachment_to_message" ADD CONSTRAINT "FK_f816633bad04a76f3a96495ddf3" FOREIGN KEY ("messageId") REFERENCES "message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "target" ADD CONSTRAINT "FK_c32ec30acb8104bda79376f3af4" FOREIGN KEY ("convertId") REFERENCES "convert"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "policy" ADD CONSTRAINT "FK_0a679332ddda27c77c914064144" FOREIGN KEY ("postCreatorId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "statistic_data" ADD CONSTRAINT "FK_c511c5355fc7b012b7ee2097325" FOREIGN KEY ("statisticId") REFERENCES "statistic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "history_users_to_post" ADD CONSTRAINT "FK_f2d3568f244296ce211306dd244" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "convert_to_post" ADD CONSTRAINT "FK_88fc2f96827f4d58ff1e86d6537" FOREIGN KEY ("convertId") REFERENCES "convert"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "goal" ADD CONSTRAINT "FK_6fd5b3818c6ebc92ef9ec4c3da3" FOREIGN KEY ("postCreatorId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "goal" DROP CONSTRAINT "FK_6fd5b3818c6ebc92ef9ec4c3da3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convert_to_post" DROP CONSTRAINT "FK_88fc2f96827f4d58ff1e86d6537"`,
    );
    await queryRunner.query(
      `ALTER TABLE "history_users_to_post" DROP CONSTRAINT "FK_f2d3568f244296ce211306dd244"`,
    );
    await queryRunner.query(
      `ALTER TABLE "statistic_data" DROP CONSTRAINT "FK_c511c5355fc7b012b7ee2097325"`,
    );
    await queryRunner.query(
      `ALTER TABLE "policy" DROP CONSTRAINT "FK_0a679332ddda27c77c914064144"`,
    );
    await queryRunner.query(
      `ALTER TABLE "target" DROP CONSTRAINT "FK_c32ec30acb8104bda79376f3af4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachment_to_message" DROP CONSTRAINT "FK_f816633bad04a76f3a96495ddf3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" DROP CONSTRAINT "FK_61fb800fdf4d052881ce8b1da29"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_95a0d2db82890455f82840563ba"`,
    );
    await queryRunner.query(
      `ALTER TABLE "strategy" DROP CONSTRAINT "FK_8149a5eda5dca7f0700fc5f0894"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."policy_type_enum_old" AS ENUM('Директива', 'Инструкция')`,
    );
    await queryRunner.query(
      `ALTER TABLE "policy" ALTER COLUMN "type" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "policy" ALTER COLUMN "type" TYPE "public"."policy_type_enum_old" USING "type"::"text"::"public"."policy_type_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "policy" ALTER COLUMN "type" SET DEFAULT 'Директива'`,
    );
    await queryRunner.query(`DROP TYPE "public"."policy_type_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."policy_type_enum_old" RENAME TO "policy_type_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "isDefault"`);
    await queryRunner.query(`ALTER TABLE "policy" DROP COLUMN "postCreatorId"`);
    await queryRunner.query(`ALTER TABLE "policy" DROP COLUMN "deadline"`);
    await queryRunner.query(`ALTER TABLE "policy" ADD "userId" uuid NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "goal" RENAME COLUMN "postCreatorId" TO "userId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" RENAME COLUMN "postCreatorId" TO "userId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "strategy" RENAME COLUMN "postCreatorId" TO "userId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "goal" ADD CONSTRAINT "FK_40bd308ea814964cec7146c6dce" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "convert_to_post" ADD CONSTRAINT "convert_to_post_convertId_fkey" FOREIGN KEY ("convertId") REFERENCES "convert"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "history_users_to_post" ADD CONSTRAINT "history_users_to_post_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "statistic_data" ADD CONSTRAINT "statistic_data_statisticId_fkey" FOREIGN KEY ("statisticId") REFERENCES "statistic"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "policy" ADD CONSTRAINT "FK_4715ad2cc885456187d2e0775f9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "target" ADD CONSTRAINT "target_convertId_fkey" FOREIGN KEY ("convertId") REFERENCES "convert"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachment_to_message" ADD CONSTRAINT "attachment_to_message_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "message"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "message_convertId_fkey" FOREIGN KEY ("convertId") REFERENCES "convert"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_7c4b0d3b77eaf26f8b4da879e63" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "strategy" ADD CONSTRAINT "FK_c1c10ab196af1494177a8b08fc9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
