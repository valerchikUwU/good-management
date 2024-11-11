import { MigrationInterface, QueryRunner } from 'typeorm';

export class AllPropsCorrection1728384398238 implements MigrationInterface {
  name = 'AllPropsCorrection1728384398238';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "goal" DROP COLUMN "orderNumber"`);
    await queryRunner.query(`ALTER TABLE "goal" DROP COLUMN "goalName"`);
    await queryRunner.query(`ALTER TABLE "target" DROP COLUMN "commonNumber"`);
    await queryRunner.query(
      `ALTER TABLE "target" DROP COLUMN "statisticNumber"`,
    );
    await queryRunner.query(`ALTER TABLE "target" DROP COLUMN "ruleNumber"`);
    await queryRunner.query(`ALTER TABLE "target" DROP COLUMN "productNumber"`);
    await queryRunner.query(
      `ALTER TABLE "strategy" DROP COLUMN "strategyName"`,
    );
    await queryRunner.query(`ALTER TABLE "target" ADD "orderNumber" integer`);
    await queryRunner.query(`ALTER TABLE "role_setting" ADD "accountId" uuid`);
    await queryRunner.query(`ALTER TABLE "goal" DROP COLUMN "content"`);
    await queryRunner.query(
      `ALTER TABLE "goal" ADD "content" text array NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "target" ALTER COLUMN "type" SET DEFAULT 'Обычная'`,
    );
    await queryRunner.query(
      `ALTER TABLE "target" ALTER COLUMN "dateStart" SET DEFAULT '"2024-10-08T10:46:40.194Z"'`,
    );
    await queryRunner.query(
      `ALTER TABLE "target" ALTER COLUMN "deadline" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_b27ea5389a49df32d110a00b0fd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ALTER COLUMN "content" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ALTER COLUMN "strategyId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "objective" ALTER COLUMN "situation" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "objective" ALTER COLUMN "content" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "objective" ALTER COLUMN "rootCause" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "policy" ALTER COLUMN "type" SET DEFAULT 'Директива'`,
    );
    await queryRunner.query(
      `ALTER TABLE "statistic" ALTER COLUMN "description" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_setting" ALTER COLUMN "can_read" SET DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" DROP CONSTRAINT "FK_5c1cf55c308037b5aca1038a131"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" DROP CONSTRAINT "FK_01d34b6e226affe884d75246ff2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ALTER COLUMN "userId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ALTER COLUMN "organizationId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_b27ea5389a49df32d110a00b0fd" FOREIGN KEY ("strategyId") REFERENCES "strategy"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_setting" ADD CONSTRAINT "FK_18ed5a2a3c6b45e7cf94fb60b56" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ADD CONSTRAINT "FK_5c1cf55c308037b5aca1038a131" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ADD CONSTRAINT "FK_01d34b6e226affe884d75246ff2" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post" DROP CONSTRAINT "FK_01d34b6e226affe884d75246ff2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" DROP CONSTRAINT "FK_5c1cf55c308037b5aca1038a131"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_setting" DROP CONSTRAINT "FK_18ed5a2a3c6b45e7cf94fb60b56"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_b27ea5389a49df32d110a00b0fd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ALTER COLUMN "organizationId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ALTER COLUMN "userId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ADD CONSTRAINT "FK_01d34b6e226affe884d75246ff2" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ADD CONSTRAINT "FK_5c1cf55c308037b5aca1038a131" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_setting" ALTER COLUMN "can_read" SET DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "statistic" ALTER COLUMN "description" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "policy" ALTER COLUMN "type" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "objective" ALTER COLUMN "rootCause" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "objective" ALTER COLUMN "content" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "objective" ALTER COLUMN "situation" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ALTER COLUMN "strategyId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ALTER COLUMN "content" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_b27ea5389a49df32d110a00b0fd" FOREIGN KEY ("strategyId") REFERENCES "strategy"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "target" ALTER COLUMN "deadline" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "target" ALTER COLUMN "dateStart" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "target" ALTER COLUMN "type" DROP DEFAULT`,
    );
    await queryRunner.query(`ALTER TABLE "goal" DROP COLUMN "content"`);
    await queryRunner.query(`ALTER TABLE "goal" ADD "content" text NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "role_setting" DROP COLUMN "accountId"`,
    );
    await queryRunner.query(`ALTER TABLE "target" DROP COLUMN "orderNumber"`);
    await queryRunner.query(
      `ALTER TABLE "strategy" ADD "strategyName" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "target" ADD "productNumber" integer`);
    await queryRunner.query(`ALTER TABLE "target" ADD "ruleNumber" integer`);
    await queryRunner.query(
      `ALTER TABLE "target" ADD "statisticNumber" integer`,
    );
    await queryRunner.query(`ALTER TABLE "target" ADD "commonNumber" integer`);
    await queryRunner.query(
      `ALTER TABLE "goal" ADD "goalName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "goal" ADD "orderNumber" integer NOT NULL DEFAULT '1'`,
    );
  }
}
