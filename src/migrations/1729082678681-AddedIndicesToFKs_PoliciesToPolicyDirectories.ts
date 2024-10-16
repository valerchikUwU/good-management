import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedIndicesToFKsPoliciesToPolicyDirectories1729082678681 implements MigrationInterface {
    name = 'AddedIndicesToFKsPoliciesToPolicyDirectories1729082678681'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "policy_directory" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "directoryName" character varying NOT NULL, "accountId" uuid NOT NULL, CONSTRAINT "PK_f825c892fc452f3847a120bfe82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "policy_to_policy_directory" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "policyId" uuid, "policyDirectoryId" uuid, CONSTRAINT "PK_39a754a55ebd3faffd57980acb2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_247be4c1647471cd372ca759a6" ON "policy_to_policy_directory" ("policyId") `);
        await queryRunner.query(`ALTER TABLE "statistic_data" ADD "valueDate" TIMESTAMP NOT NULL DEFAULT '"2024-10-16T12:44:40.843Z"'`);
        await queryRunner.query(`ALTER TABLE "target" ALTER COLUMN "dateStart" SET DEFAULT '"2024-10-16T12:44:40.833Z"'`);
        await queryRunner.query(`CREATE INDEX "IDX_c6e8ae55a4db3584686cbf6afe" ON "goal" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b5b7a1399bb79f0a6f817e2629" ON "target_holder" ("targetId") `);
        await queryRunner.query(`CREATE INDEX "IDX_24d8851d99d78fa2b8ff2882b8" ON "target_holder" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b417a52ac7f5278f81327dfa86" ON "target" ("projectId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b27ea5389a49df32d110a00b0f" ON "project" ("strategyId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3b9f2b0b950b992feb67e225e3" ON "objective" ("strategyId") `);
        await queryRunner.query(`CREATE INDEX "IDX_7a4f1c4b3f10e3c6926a722523" ON "policy_to_organization" ("policyId") `);
        await queryRunner.query(`CREATE INDEX "IDX_73d4f7b976285b1908669638e6" ON "policy_to_organization" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5c1cf55c308037b5aca1038a13" ON "post" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f3517008f0c70943e789681270" ON "post" ("policyId") `);
        await queryRunner.query(`CREATE INDEX "IDX_01d34b6e226affe884d75246ff" ON "post" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_68d3c22dbd95449360fdbf7a3f" ON "user" ("accountId") `);
        await queryRunner.query(`ALTER TABLE "policy_directory" ADD CONSTRAINT "FK_2c1a0fcd287885bac0d8bc1eb02" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "policy_to_policy_directory" ADD CONSTRAINT "FK_247be4c1647471cd372ca759a61" FOREIGN KEY ("policyId") REFERENCES "policy"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "policy_to_policy_directory" ADD CONSTRAINT "FK_fa28233afa6009d479df0e2fbb9" FOREIGN KEY ("policyDirectoryId") REFERENCES "policy_directory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "policy_to_policy_directory" DROP CONSTRAINT "FK_fa28233afa6009d479df0e2fbb9"`);
        await queryRunner.query(`ALTER TABLE "policy_to_policy_directory" DROP CONSTRAINT "FK_247be4c1647471cd372ca759a61"`);
        await queryRunner.query(`ALTER TABLE "policy_directory" DROP CONSTRAINT "FK_2c1a0fcd287885bac0d8bc1eb02"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_68d3c22dbd95449360fdbf7a3f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_01d34b6e226affe884d75246ff"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f3517008f0c70943e789681270"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5c1cf55c308037b5aca1038a13"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_73d4f7b976285b1908669638e6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7a4f1c4b3f10e3c6926a722523"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3b9f2b0b950b992feb67e225e3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b27ea5389a49df32d110a00b0f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b417a52ac7f5278f81327dfa86"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_24d8851d99d78fa2b8ff2882b8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b5b7a1399bb79f0a6f817e2629"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c6e8ae55a4db3584686cbf6afe"`);
        await queryRunner.query(`ALTER TABLE "target" ALTER COLUMN "dateStart" SET DEFAULT '2024-10-10 14:55:01.465'`);
        await queryRunner.query(`ALTER TABLE "statistic_data" DROP COLUMN "valueDate"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_247be4c1647471cd372ca759a6"`);
        await queryRunner.query(`DROP TABLE "policy_to_policy_directory"`);
        await queryRunner.query(`DROP TABLE "policy_directory"`);
    }

}
