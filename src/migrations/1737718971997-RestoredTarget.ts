import { MigrationInterface, QueryRunner } from 'typeorm';

export class RestoredTarget1737718971997 implements MigrationInterface {
  name = 'RestoredTarget1737718971997';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "target" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."target_type_enum" NOT NULL DEFAULT 'Обычная', "orderNumber" integer NOT NULL, "content" text NOT NULL, "holderPostId" uuid NOT NULL, "targetState" "public"."target_targetstate_enum" NOT NULL DEFAULT 'Активная', "dateStart" TIMESTAMP NOT NULL DEFAULT now(), "deadline" TIMESTAMP, "dateComplete" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "projectId" uuid, "policyId" uuid, CONSTRAINT "PK_9d962204b13c18851ea88fc72f3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b417a52ac7f5278f81327dfa86" ON "target" ("projectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1e4be9fdeee9449f164f5dc44b" ON "target" ("policyId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "target_holder" ADD CONSTRAINT "FK_b5b7a1399bb79f0a6f817e26297" FOREIGN KEY ("targetId") REFERENCES "target"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "target" ADD CONSTRAINT "FK_b417a52ac7f5278f81327dfa86f" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "target" ADD CONSTRAINT "FK_1e4be9fdeee9449f164f5dc44b4" FOREIGN KEY ("policyId") REFERENCES "policy"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "target" DROP CONSTRAINT "FK_1e4be9fdeee9449f164f5dc44b4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "target" DROP CONSTRAINT "FK_b417a52ac7f5278f81327dfa86f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "target_holder" DROP CONSTRAINT "FK_b5b7a1399bb79f0a6f817e26297"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1e4be9fdeee9449f164f5dc44b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b417a52ac7f5278f81327dfa86"`,
    );
    await queryRunner.query(`DROP TABLE "target"`);
  }
}
