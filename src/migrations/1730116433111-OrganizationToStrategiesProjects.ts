import { MigrationInterface, QueryRunner } from 'typeorm';

export class OrganizationToStrategiesProjects1730116433111
  implements MigrationInterface
{
  name = 'OrganizationToStrategiesProjects1730116433111';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "group_to_user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "groupId" uuid, CONSTRAINT "PK_d142e43baebc5f1abe2941950b6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fce96ee0c8cf3a4ac80bf7e757" ON "group_to_user" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8f0d7f4568fd0fb3b65ee8151b" ON "group_to_user" ("groupId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "group" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "groupName" character varying(50) NOT NULL, "groupNumber" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "accountId" uuid NOT NULL, CONSTRAINT "PK_256aa0fda9b1de1a73ee0b7106b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "project" ADD "organizationId" uuid`);
    await queryRunner.query(`ALTER TABLE "strategy" ADD "organizationId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_0028dfadf312a1d7f51656c4a9a" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "strategy" ADD CONSTRAINT "FK_64a83d4b62181b7560b9a4907c6" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_to_user" ADD CONSTRAINT "FK_fce96ee0c8cf3a4ac80bf7e757d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_to_user" ADD CONSTRAINT "FK_8f0d7f4568fd0fb3b65ee8151b6" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "group" ADD CONSTRAINT "FK_c04a5c02d4950e967a37eaf1733" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "group" DROP CONSTRAINT "FK_c04a5c02d4950e967a37eaf1733"`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_to_user" DROP CONSTRAINT "FK_8f0d7f4568fd0fb3b65ee8151b6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_to_user" DROP CONSTRAINT "FK_fce96ee0c8cf3a4ac80bf7e757d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "strategy" DROP CONSTRAINT "FK_64a83d4b62181b7560b9a4907c6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_0028dfadf312a1d7f51656c4a9a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "strategy" DROP COLUMN "organizationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP COLUMN "organizationId"`,
    );
    await queryRunner.query(`DROP TABLE "group"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8f0d7f4568fd0fb3b65ee8151b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fce96ee0c8cf3a4ac80bf7e757"`,
    );
    await queryRunner.query(`DROP TABLE "group_to_user"`);
  }
}
