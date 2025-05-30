import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedWatcherIdsToConvert1741696373679
  implements MigrationInterface
{
  name = 'AddedWatcherIdsToConvert1741696373679';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "convert" ADD "watcherIds" uuid array`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "convert" DROP COLUMN "watcherIds"`);
  }
}
