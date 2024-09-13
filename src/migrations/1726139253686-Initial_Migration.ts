import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1726139253686 implements MigrationInterface {
    name = 'InitialMigration1726139253686'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "refresh_session" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_agent" character varying(200) NOT NULL, "fingerprint" character varying(200) NOT NULL, "ip" character varying NOT NULL, "expiresIn" integer NOT NULL, "refreshToken" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_5d0d8c21064803b5b2baaa50cbb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "account" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "accountName" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "organization" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "organizationName" character varying NOT NULL, "parentOrganizationId" uuid, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "accountId" uuid NOT NULL, CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "post" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "postName" character varying NOT NULL, "divisionName" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "organizationId" uuid NOT NULL, CONSTRAINT "REL_5c1cf55c308037b5aca1038a13" UNIQUE ("userId"), CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "goal" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "goalName" character varying NOT NULL, "orderNumber" integer NOT NULL DEFAULT '1', "content" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, CONSTRAINT "PK_88c8e2b461b711336c836b1e130" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."policy_state_enum" AS ENUM('Черновик', 'Активный', 'Отменён')`);
        await queryRunner.query(`CREATE TABLE "policy" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "policyName" character varying NOT NULL, "state" "public"."policy_state_enum" NOT NULL DEFAULT 'Черновик', "dateActive" TIMESTAMP, "path" character varying NOT NULL, "size" integer NOT NULL, "mimetype" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, CONSTRAINT "PK_9917b0c5e4286703cc656b1d39f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."project_type_enum" AS ENUM('Проект', 'Программа')`);
        await queryRunner.query(`CREATE TABLE "project" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "programId" uuid, "content" text NOT NULL, "type" "public"."project_type_enum" NOT NULL DEFAULT 'Проект', CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."target_type_enum" AS ENUM('Обычная', 'Статистика', 'Правила', 'Продукт')`);
        await queryRunner.query(`CREATE TABLE "target" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."target_type_enum" NOT NULL DEFAULT 'Обычная', "orderNumber" integer NOT NULL DEFAULT '1', "content" text NOT NULL, "dateStart" TIMESTAMP NOT NULL, "deadline" TIMESTAMP NOT NULL, "dateComplete" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "projectId" uuid, CONSTRAINT "PK_9d962204b13c18851ea88fc72f3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "target_holder" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "targetId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "REL_b5b7a1399bb79f0a6f817e2629" UNIQUE ("targetId"), CONSTRAINT "PK_be0687cc758ff63787237a40a14" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying(50), "lastName" character varying(50), "telegramId" integer, "telephoneNumber" character varying, "avatar_url" character varying, "vk_id" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "organizationId" uuid NOT NULL, "accountId" uuid NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "objective" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "orderNumber" integer NOT NULL, "situation" text NOT NULL, "content" text NOT NULL, "rootCause" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "strategyId" uuid NOT NULL, CONSTRAINT "PK_1084365b2a588160b31361a252e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."strategy_state_enum" AS ENUM('Черновик', 'Активный', 'Завершено')`);
        await queryRunner.query(`CREATE TABLE "strategy" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "strategyNumber" SERIAL NOT NULL, "strategyName" character varying NOT NULL, "dateActive" TIMESTAMP, "path" character varying NOT NULL, "size" integer NOT NULL, "mimetype" character varying NOT NULL, "state" "public"."strategy_state_enum" NOT NULL DEFAULT 'Черновик', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, CONSTRAINT "PK_733d2c3d4a73c020375b9b3581d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "refresh_session" ADD CONSTRAINT "FK_3ae1d1221dbc787b1633dad301f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organization" ADD CONSTRAINT "FK_a1f50c955a5225aa6146bd38ead" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_5c1cf55c308037b5aca1038a131" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_01d34b6e226affe884d75246ff2" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "goal" ADD CONSTRAINT "FK_40bd308ea814964cec7146c6dce" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "policy" ADD CONSTRAINT "FK_4715ad2cc885456187d2e0775f9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "target" ADD CONSTRAINT "FK_b417a52ac7f5278f81327dfa86f" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "target_holder" ADD CONSTRAINT "FK_b5b7a1399bb79f0a6f817e26297" FOREIGN KEY ("targetId") REFERENCES "target"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "target_holder" ADD CONSTRAINT "FK_24d8851d99d78fa2b8ff2882b81" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_dfda472c0af7812401e592b6a61" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_68d3c22dbd95449360fdbf7a3f1" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "objective" ADD CONSTRAINT "FK_3b9f2b0b950b992feb67e225e39" FOREIGN KEY ("strategyId") REFERENCES "strategy"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "strategy" ADD CONSTRAINT "FK_c1c10ab196af1494177a8b08fc9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "strategy" DROP CONSTRAINT "FK_c1c10ab196af1494177a8b08fc9"`);
        await queryRunner.query(`ALTER TABLE "objective" DROP CONSTRAINT "FK_3b9f2b0b950b992feb67e225e39"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_68d3c22dbd95449360fdbf7a3f1"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_dfda472c0af7812401e592b6a61"`);
        await queryRunner.query(`ALTER TABLE "target_holder" DROP CONSTRAINT "FK_24d8851d99d78fa2b8ff2882b81"`);
        await queryRunner.query(`ALTER TABLE "target_holder" DROP CONSTRAINT "FK_b5b7a1399bb79f0a6f817e26297"`);
        await queryRunner.query(`ALTER TABLE "target" DROP CONSTRAINT "FK_b417a52ac7f5278f81327dfa86f"`);
        await queryRunner.query(`ALTER TABLE "policy" DROP CONSTRAINT "FK_4715ad2cc885456187d2e0775f9"`);
        await queryRunner.query(`ALTER TABLE "goal" DROP CONSTRAINT "FK_40bd308ea814964cec7146c6dce"`);
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_01d34b6e226affe884d75246ff2"`);
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_5c1cf55c308037b5aca1038a131"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "FK_a1f50c955a5225aa6146bd38ead"`);
        await queryRunner.query(`ALTER TABLE "refresh_session" DROP CONSTRAINT "FK_3ae1d1221dbc787b1633dad301f"`);
        await queryRunner.query(`DROP TABLE "strategy"`);
        await queryRunner.query(`DROP TYPE "public"."strategy_state_enum"`);
        await queryRunner.query(`DROP TABLE "objective"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "target_holder"`);
        await queryRunner.query(`DROP TABLE "target"`);
        await queryRunner.query(`DROP TYPE "public"."target_type_enum"`);
        await queryRunner.query(`DROP TABLE "project"`);
        await queryRunner.query(`DROP TYPE "public"."project_type_enum"`);
        await queryRunner.query(`DROP TABLE "policy"`);
        await queryRunner.query(`DROP TYPE "public"."policy_state_enum"`);
        await queryRunner.query(`DROP TABLE "goal"`);
        await queryRunner.query(`DROP TABLE "post"`);
        await queryRunner.query(`DROP TABLE "organization"`);
        await queryRunner.query(`DROP TABLE "account"`);
        await queryRunner.query(`DROP TABLE "refresh_session"`);
    }

}
