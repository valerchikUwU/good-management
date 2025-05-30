import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemovedSenderPostId1744983353021 implements MigrationInterface {
  name = 'RemovedSenderPostId1744983353021';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "target" DROP CONSTRAINT "FK_c4c07ec516381bc0013a48cb143"`,
    );
    await queryRunner.query(
      `ALTER TABLE "target" DROP CONSTRAINT "target_projectId_fkey"`,
    );
    await queryRunner.query(`ALTER TABLE "target" DROP COLUMN "senderPostId"`);
    await queryRunner.query(
      `ALTER TABLE "target" ADD CONSTRAINT "FK_b417a52ac7f5278f81327dfa86f" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "target" DROP CONSTRAINT "FK_b417a52ac7f5278f81327dfa86f"`,
    );
    await queryRunner.query(`ALTER TABLE "target" ADD "senderPostId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "target" ADD CONSTRAINT "target_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "target" ADD CONSTRAINT "FK_c4c07ec516381bc0013a48cb143" FOREIGN KEY ("senderPostId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
