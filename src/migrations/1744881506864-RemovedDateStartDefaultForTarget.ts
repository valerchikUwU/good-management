import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemovedDateStartDefaultForTarget1744881506864
  implements MigrationInterface
{
  name = 'RemovedDateStartDefaultForTarget1744881506864';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "target" DROP CONSTRAINT "target_projectId_fkey"`,
    );
    await queryRunner.query(
      `ALTER TABLE "target" ALTER COLUMN "dateStart" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "target" ALTER COLUMN "dateStart" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "target" ADD CONSTRAINT "FK_b417a52ac7f5278f81327dfa86f" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "target" DROP CONSTRAINT "FK_b417a52ac7f5278f81327dfa86f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "target" ALTER COLUMN "dateStart" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "target" ALTER COLUMN "dateStart" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "target" ADD CONSTRAINT "target_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
