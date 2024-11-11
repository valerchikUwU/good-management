import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedStatisticAndStatData1726495363608
  implements MigrationInterface
{
  name = 'AddedStatisticAndStatData1726495363608';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "statistic_data" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "value" integer NOT NULL, "statisticId" uuid, CONSTRAINT "REL_c511c5355fc7b012b7ee209732" UNIQUE ("statisticId"), CONSTRAINT "PK_843497079685d8d08e6b701c6c7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."statistic_type_enum" AS ENUM('Прямая', 'Перевернутая')`,
    );
    await queryRunner.query(
      `CREATE TABLE "statistic" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."statistic_type_enum" NOT NULL DEFAULT 'Прямая', "name" text NOT NULL, "description" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "postId" uuid, CONSTRAINT "PK_e3e6fd496e1988019d8a46749ae" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "strategy" DROP COLUMN "size"`);
    await queryRunner.query(`ALTER TABLE "strategy" DROP COLUMN "path"`);
    await queryRunner.query(`ALTER TABLE "strategy" DROP COLUMN "mimetype"`);
    await queryRunner.query(
      `CREATE TYPE "public"."policy_type_enum" AS ENUM('Директива', 'Инструкция')`,
    );
    await queryRunner.query(
      `ALTER TABLE "policy" ADD "type" "public"."policy_type_enum" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "strategy" ADD "content" text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD "strategyId" uuid NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "post" ADD "parentId" uuid`);
    await queryRunner.query(`ALTER TABLE "post" ADD "product" text NOT NULL`);
    await queryRunner.query(`ALTER TABLE "post" ADD "purpose" text NOT NULL`);
    await queryRunner.query(`ALTER TABLE "post" ADD "policyId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "post" ADD CONSTRAINT "UQ_f3517008f0c70943e789681270b" UNIQUE ("policyId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_dfda472c0af7812401e592b6a61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "organizationId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_b27ea5389a49df32d110a00b0fd" FOREIGN KEY ("strategyId") REFERENCES "strategy"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "statistic_data" ADD CONSTRAINT "FK_c511c5355fc7b012b7ee2097325" FOREIGN KEY ("statisticId") REFERENCES "statistic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "statistic" ADD CONSTRAINT "FK_69ecb1c729c210beca6dba550db" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ADD CONSTRAINT "FK_f3517008f0c70943e789681270b" FOREIGN KEY ("policyId") REFERENCES "policy"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_dfda472c0af7812401e592b6a61" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_dfda472c0af7812401e592b6a61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" DROP CONSTRAINT "FK_f3517008f0c70943e789681270b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "statistic" DROP CONSTRAINT "FK_69ecb1c729c210beca6dba550db"`,
    );
    await queryRunner.query(
      `ALTER TABLE "statistic_data" DROP CONSTRAINT "FK_c511c5355fc7b012b7ee2097325"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_b27ea5389a49df32d110a00b0fd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "organizationId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_dfda472c0af7812401e592b6a61" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" DROP CONSTRAINT "UQ_f3517008f0c70943e789681270b"`,
    );
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "policyId"`);
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "purpose"`);
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "product"`);
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "parentId"`);
    await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "strategyId"`);
    await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "strategy" DROP COLUMN "content"`);
    await queryRunner.query(`ALTER TABLE "policy" DROP COLUMN "type"`);
    await queryRunner.query(`DROP TYPE "public"."policy_type_enum"`);
    await queryRunner.query(
      `ALTER TABLE "strategy" ADD "mimetype" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "strategy" ADD "path" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "strategy" ADD "size" integer NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "statistic"`);
    await queryRunner.query(`DROP TYPE "public"."statistic_type_enum"`);
    await queryRunner.query(`DROP TABLE "statistic_data"`);
  }
}
