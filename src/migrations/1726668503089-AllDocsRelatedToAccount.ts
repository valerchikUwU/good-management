import { MigrationInterface, QueryRunner } from 'typeorm';

export class AllDocsRelatedToAccount1726668503089
  implements MigrationInterface
{
  name = 'AllDocsRelatedToAccount1726668503089';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "policy" ADD "accountId" uuid NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "goal" ADD "accountId" uuid NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "objective" ADD "accountId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD "accountId" uuid NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "project" ADD "userId" uuid NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "strategy" ADD "accountId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "policy" ADD CONSTRAINT "FK_77ba8d6f7aeefafedc654d025d2" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "goal" ADD CONSTRAINT "FK_45a4ad62e05e7e3997a0649c7ac" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "objective" ADD CONSTRAINT "FK_e25ea3b661229ee317734f840b3" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_8d691f8d69acef59f4ed3a872c4" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_7c4b0d3b77eaf26f8b4da879e63" FOREIGN KEY ("userId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "strategy" ADD CONSTRAINT "FK_27bc46cc455f581f0fa58b29f9f" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "strategy" DROP CONSTRAINT "FK_27bc46cc455f581f0fa58b29f9f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_7c4b0d3b77eaf26f8b4da879e63"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_8d691f8d69acef59f4ed3a872c4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "objective" DROP CONSTRAINT "FK_e25ea3b661229ee317734f840b3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "goal" DROP CONSTRAINT "FK_45a4ad62e05e7e3997a0649c7ac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "policy" DROP CONSTRAINT "FK_77ba8d6f7aeefafedc654d025d2"`,
    );
    await queryRunner.query(`ALTER TABLE "strategy" DROP COLUMN "accountId"`);
    await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "accountId"`);
    await queryRunner.query(`ALTER TABLE "objective" DROP COLUMN "accountId"`);
    await queryRunner.query(`ALTER TABLE "goal" DROP COLUMN "accountId"`);
    await queryRunner.query(`ALTER TABLE "policy" DROP COLUMN "accountId"`);
  }
}
