import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedOnDeleteOptions1740142639174 implements MigrationInterface {
  name = 'AddedOnDeleteOptions1740142639174';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "target_holder" DROP CONSTRAINT "FK_b5b7a1399bb79f0a6f817e26297"`,
    );
    await queryRunner.query(
      `ALTER TABLE "policy_to_policy_directory" DROP CONSTRAINT "FK_fa28233afa6009d479df0e2fbb9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachment_to_target" DROP CONSTRAINT "FK_6aacb469923096e42216b9ba22a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "panel_to_statistic" DROP CONSTRAINT "FK_7b4fbbcc0a5cb0fcb2d1041141d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "target_holder" ADD CONSTRAINT "FK_b5b7a1399bb79f0a6f817e26297" FOREIGN KEY ("targetId") REFERENCES "target"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "policy_to_policy_directory" ADD CONSTRAINT "FK_fa28233afa6009d479df0e2fbb9" FOREIGN KEY ("policyDirectoryId") REFERENCES "policy_directory"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachment_to_target" ADD CONSTRAINT "FK_6aacb469923096e42216b9ba22a" FOREIGN KEY ("attachmentId") REFERENCES "attachment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "panel_to_statistic" ADD CONSTRAINT "FK_7b4fbbcc0a5cb0fcb2d1041141d" FOREIGN KEY ("controlPanelId") REFERENCES "control_panel"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "panel_to_statistic" DROP CONSTRAINT "FK_7b4fbbcc0a5cb0fcb2d1041141d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachment_to_target" DROP CONSTRAINT "FK_6aacb469923096e42216b9ba22a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "policy_to_policy_directory" DROP CONSTRAINT "FK_fa28233afa6009d479df0e2fbb9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "target_holder" DROP CONSTRAINT "FK_b5b7a1399bb79f0a6f817e26297"`,
    );
    await queryRunner.query(
      `ALTER TABLE "panel_to_statistic" ADD CONSTRAINT "FK_7b4fbbcc0a5cb0fcb2d1041141d" FOREIGN KEY ("controlPanelId") REFERENCES "control_panel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachment_to_target" ADD CONSTRAINT "FK_6aacb469923096e42216b9ba22a" FOREIGN KEY ("attachmentId") REFERENCES "attachment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "policy_to_policy_directory" ADD CONSTRAINT "FK_fa28233afa6009d479df0e2fbb9" FOREIGN KEY ("policyDirectoryId") REFERENCES "policy_directory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "target_holder" ADD CONSTRAINT "FK_b5b7a1399bb79f0a6f817e26297" FOREIGN KEY ("targetId") REFERENCES "target"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
