import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedFlagsForUserAndPost1747125815420
  implements MigrationInterface
{
  name = 'AddedFlagsForUserAndPost1747125815420';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "message_seen_status" DROP CONSTRAINT "FK_1ff33fee84d2c7958ab60dbfad0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachment_to_message" DROP CONSTRAINT "FK_13f0723c85fbc64fb393065df6d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachment_to_message" DROP CONSTRAINT "FK_f816633bad04a76f3a96495ddf3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachment_to_target" DROP CONSTRAINT "FK_6aacb469923096e42216b9ba22a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "panel_to_statistic" DROP CONSTRAINT "FK_cc0da47767faed658adf3ed30dd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "history_users_to_post" DROP CONSTRAINT "FK_7541e4a4eb8305af0fc44012bed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "history_users_to_post" DROP CONSTRAINT "FK_f2d3568f244296ce211306dd244"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ADD "isArchive" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isFired" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_seen_status" ADD CONSTRAINT "FK_1ff33fee84d2c7958ab60dbfad0" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachment_to_message" ADD CONSTRAINT "FK_13f0723c85fbc64fb393065df6d" FOREIGN KEY ("attachmentId") REFERENCES "attachment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachment_to_message" ADD CONSTRAINT "FK_f816633bad04a76f3a96495ddf3" FOREIGN KEY ("messageId") REFERENCES "message"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachment_to_target" ADD CONSTRAINT "FK_6aacb469923096e42216b9ba22a" FOREIGN KEY ("attachmentId") REFERENCES "attachment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "panel_to_statistic" ADD CONSTRAINT "FK_cc0da47767faed658adf3ed30dd" FOREIGN KEY ("statisticId") REFERENCES "statistic"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "history_users_to_post" ADD CONSTRAINT "FK_f2d3568f244296ce211306dd244" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "history_users_to_post" ADD CONSTRAINT "FK_7541e4a4eb8305af0fc44012bed" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "history_users_to_post" DROP CONSTRAINT "FK_7541e4a4eb8305af0fc44012bed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "history_users_to_post" DROP CONSTRAINT "FK_f2d3568f244296ce211306dd244"`,
    );
    await queryRunner.query(
      `ALTER TABLE "panel_to_statistic" DROP CONSTRAINT "FK_cc0da47767faed658adf3ed30dd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachment_to_target" DROP CONSTRAINT "FK_6aacb469923096e42216b9ba22a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachment_to_message" DROP CONSTRAINT "FK_f816633bad04a76f3a96495ddf3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachment_to_message" DROP CONSTRAINT "FK_13f0723c85fbc64fb393065df6d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_seen_status" DROP CONSTRAINT "FK_1ff33fee84d2c7958ab60dbfad0"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isFired"`);
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "isArchive"`);
    await queryRunner.query(
      `ALTER TABLE "history_users_to_post" ADD CONSTRAINT "FK_f2d3568f244296ce211306dd244" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "history_users_to_post" ADD CONSTRAINT "FK_7541e4a4eb8305af0fc44012bed" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "panel_to_statistic" ADD CONSTRAINT "FK_cc0da47767faed658adf3ed30dd" FOREIGN KEY ("statisticId") REFERENCES "statistic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachment_to_target" ADD CONSTRAINT "FK_6aacb469923096e42216b9ba22a" FOREIGN KEY ("attachmentId") REFERENCES "attachment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachment_to_message" ADD CONSTRAINT "FK_f816633bad04a76f3a96495ddf3" FOREIGN KEY ("messageId") REFERENCES "message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachment_to_message" ADD CONSTRAINT "FK_13f0723c85fbc64fb393065df6d" FOREIGN KEY ("attachmentId") REFERENCES "attachment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_seen_status" ADD CONSTRAINT "FK_1ff33fee84d2c7958ab60dbfad0" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
