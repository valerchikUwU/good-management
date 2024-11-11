import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserRenamedTargetProp1728566452301 implements MigrationInterface {
  name = 'UserRenamedTargetProp1728566452301';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "target" RENAME COLUMN "activeResponsibleUserId" TO "holderUserId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "target" ALTER COLUMN "dateStart" SET DEFAULT '"2024-10-10T13:20:54.444Z"'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "target" ALTER COLUMN "dateStart" SET DEFAULT '2024-10-10 11:17:05.726'`,
    );
    await queryRunner.query(
      `ALTER TABLE "target" RENAME COLUMN "holderUserId" TO "activeResponsibleUserId"`,
    );
  }
}
