import { MigrationInterface, QueryRunner } from 'typeorm';

export class SolvedManyToManyRelations1726147420987
  implements MigrationInterface
{
  name = 'SolvedManyToManyRelations1726147420987';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "goal_to_organization" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "goalId" uuid, "organizationId" uuid, CONSTRAINT "PK_f6eb8f2ecfe212219e78c8f7336" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "strategy_to_organization" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "strategyId" uuid, "organizationId" uuid, CONSTRAINT "PK_4f97006b85117be21177a71845d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "objective_to_organization" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "objectiveId" uuid, "organizationId" uuid, CONSTRAINT "PK_af16725dc2bbc4c859a2bc1c0b0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "policy_to_organization" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "policyId" uuid, "organizationId" uuid, CONSTRAINT "PK_382bfa772033f9eda99c1b0aa39" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "project_to_organization" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "projectId" uuid, "organizationId" uuid, CONSTRAINT "PK_6a5564d81a85ba3d5e159dc207b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "goal_to_organization" ADD CONSTRAINT "FK_c8c9b8ea50f310445dedf1485ac" FOREIGN KEY ("goalId") REFERENCES "goal"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "goal_to_organization" ADD CONSTRAINT "FK_70d2138ea703eb2dfa72b1981a7" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "strategy_to_organization" ADD CONSTRAINT "FK_c7155aaf00a525e404e6094189b" FOREIGN KEY ("strategyId") REFERENCES "strategy"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "strategy_to_organization" ADD CONSTRAINT "FK_05a3719d376530f0c0cac77238a" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "objective_to_organization" ADD CONSTRAINT "FK_439241ddf9b58e8314aaed6783d" FOREIGN KEY ("objectiveId") REFERENCES "objective"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "objective_to_organization" ADD CONSTRAINT "FK_aa95fcdd80ad14c610aa05a7251" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "policy_to_organization" ADD CONSTRAINT "FK_7a4f1c4b3f10e3c6926a722523f" FOREIGN KEY ("policyId") REFERENCES "policy"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "policy_to_organization" ADD CONSTRAINT "FK_73d4f7b976285b1908669638e67" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_to_organization" ADD CONSTRAINT "FK_4ef182a0389a327f4c95c267b5e" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_to_organization" ADD CONSTRAINT "FK_1e8bf942b3cb0ace55196c54457" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_to_organization" DROP CONSTRAINT "FK_1e8bf942b3cb0ace55196c54457"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_to_organization" DROP CONSTRAINT "FK_4ef182a0389a327f4c95c267b5e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "policy_to_organization" DROP CONSTRAINT "FK_73d4f7b976285b1908669638e67"`,
    );
    await queryRunner.query(
      `ALTER TABLE "policy_to_organization" DROP CONSTRAINT "FK_7a4f1c4b3f10e3c6926a722523f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "objective_to_organization" DROP CONSTRAINT "FK_aa95fcdd80ad14c610aa05a7251"`,
    );
    await queryRunner.query(
      `ALTER TABLE "objective_to_organization" DROP CONSTRAINT "FK_439241ddf9b58e8314aaed6783d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "strategy_to_organization" DROP CONSTRAINT "FK_05a3719d376530f0c0cac77238a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "strategy_to_organization" DROP CONSTRAINT "FK_c7155aaf00a525e404e6094189b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "goal_to_organization" DROP CONSTRAINT "FK_70d2138ea703eb2dfa72b1981a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "goal_to_organization" DROP CONSTRAINT "FK_c8c9b8ea50f310445dedf1485ac"`,
    );
    await queryRunner.query(`DROP TABLE "project_to_organization"`);
    await queryRunner.query(`DROP TABLE "policy_to_organization"`);
    await queryRunner.query(`DROP TABLE "objective_to_organization"`);
    await queryRunner.query(`DROP TABLE "strategy_to_organization"`);
    await queryRunner.query(`DROP TABLE "goal_to_organization"`);
  }
}
