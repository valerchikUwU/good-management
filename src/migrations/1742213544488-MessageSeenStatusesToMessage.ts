import { MigrationInterface, QueryRunner } from 'typeorm';

export class MessageSeenStatusesToMessage1742213544488
  implements MigrationInterface
{
  name = 'MessageSeenStatusesToMessage1742213544488';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "message_seen_status" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "timeSeen" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "messageId" uuid NOT NULL, "postId" uuid NOT NULL, CONSTRAINT "PK_78fc09fa004973ad15589ed890b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "timeSeen"`);
    await queryRunner.query(
      `ALTER TABLE "message_seen_status" ADD CONSTRAINT "FK_4f47e188f1bd628421d0f233327" FOREIGN KEY ("messageId") REFERENCES "message"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_seen_status" ADD CONSTRAINT "FK_1ff33fee84d2c7958ab60dbfad0" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "message_seen_status" DROP CONSTRAINT "FK_1ff33fee84d2c7958ab60dbfad0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_seen_status" DROP CONSTRAINT "FK_4f47e188f1bd628421d0f233327"`,
    );
    await queryRunner.query(`ALTER TABLE "message" ADD "timeSeen" TIMESTAMP`);
    await queryRunner.query(`DROP TABLE "message_seen_status"`);
  }
}
