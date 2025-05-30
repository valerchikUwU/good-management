import { MigrationInterface, QueryRunner } from 'typeorm';

export class WatchersToConvert1742379951287 implements MigrationInterface {
  name = 'WatchersToConvert1742379951287';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "watchers_to_convert" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "unreadMessagesCount" integer NOT NULL DEFAULT '0', "lastSeenNumber" integer, "convertId" uuid NOT NULL, "postId" uuid NOT NULL, CONSTRAINT "PK_1ef8dfa8b63aa69ec35be830253" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "convert" DROP COLUMN "watcherIds"`);
    await queryRunner.query(
      `ALTER TABLE "watchers_to_convert" ADD CONSTRAINT "FK_79ed7ea972c5fd0304ec26a6b93" FOREIGN KEY ("convertId") REFERENCES "convert"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "watchers_to_convert" ADD CONSTRAINT "FK_3e780977eefdf98e496f90322a5" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "watchers_to_convert" DROP CONSTRAINT "FK_3e780977eefdf98e496f90322a5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "watchers_to_convert" DROP CONSTRAINT "FK_79ed7ea972c5fd0304ec26a6b93"`,
    );
    await queryRunner.query(
      `ALTER TABLE "convert" ADD "watcherIds" uuid array`,
    );
    await queryRunner.query(`DROP TABLE "watchers_to_convert"`);
  }
}
