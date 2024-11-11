import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedFilesToPolicy1727777928764 implements MigrationInterface {
  name = 'AddedFilesToPolicy1727777928764';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fileName" character varying NOT NULL, "path" character varying NOT NULL, "size" integer NOT NULL, "mimetype" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "policyId" uuid, CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "file" ADD CONSTRAINT "FK_53940b40b330b963b360df7a29e" FOREIGN KEY ("policyId") REFERENCES "policy"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "file" DROP CONSTRAINT "FK_53940b40b330b963b360df7a29e"`,
    );
    await queryRunner.query(`DROP TABLE "file"`);
  }
}
