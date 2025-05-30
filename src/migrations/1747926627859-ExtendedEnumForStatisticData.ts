import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExtendedEnumForStatisticData1747926627859
  implements MigrationInterface
{
  name = 'ExtendedEnumForStatisticData1747926627859';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refresh_session" DROP CONSTRAINT "refresh_session_userId_fkey"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_session" ADD CONSTRAINT "FK_3ae1d1221dbc787b1633dad301f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refresh_session" DROP CONSTRAINT "FK_3ae1d1221dbc787b1633dad301f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_session" ADD CONSTRAINT "refresh_session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}
