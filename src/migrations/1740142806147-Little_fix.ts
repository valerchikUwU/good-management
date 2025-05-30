import { MigrationInterface, QueryRunner } from 'typeorm';

export class LittleFix1740142806147 implements MigrationInterface {
  name = 'LittleFix1740142806147';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "attachment_to_target" DROP CONSTRAINT "FK_0ebf12db8fd34879e66590fea2c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachment_to_target" DROP CONSTRAINT "FK_6aacb469923096e42216b9ba22a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachment_to_target" ADD CONSTRAINT "FK_6aacb469923096e42216b9ba22a" FOREIGN KEY ("attachmentId") REFERENCES "attachment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachment_to_target" ADD CONSTRAINT "FK_0ebf12db8fd34879e66590fea2c" FOREIGN KEY ("targetId") REFERENCES "target"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "attachment_to_target" DROP CONSTRAINT "FK_0ebf12db8fd34879e66590fea2c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachment_to_target" DROP CONSTRAINT "FK_6aacb469923096e42216b9ba22a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachment_to_target" ADD CONSTRAINT "FK_6aacb469923096e42216b9ba22a" FOREIGN KEY ("attachmentId") REFERENCES "attachment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "attachment_to_target" ADD CONSTRAINT "FK_0ebf12db8fd34879e66590fea2c" FOREIGN KEY ("targetId") REFERENCES "target"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
