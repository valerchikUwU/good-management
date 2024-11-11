import { MigrationInterface, QueryRunner } from 'typeorm';

export class RoleSettingsToRole1727959841624 implements MigrationInterface {
  name = 'RoleSettingsToRole1727959841624';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."role_setting_module_enum" AS ENUM('policy', 'goal', 'objective', 'strategy', 'project', 'post', 'statistic')`,
    );
    await queryRunner.query(
      `CREATE TABLE "role_setting" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "module" "public"."role_setting_module_enum" NOT NULL, "can_read" boolean NOT NULL DEFAULT false, "can_create" boolean NOT NULL DEFAULT false, "can_update" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "roleId" uuid, CONSTRAINT "PK_d95dd723687e9e68b1d6ed9f8de" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_setting" ADD CONSTRAINT "FK_16d0b9882145d7d5a0cfa352a2d" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "role_setting" DROP CONSTRAINT "FK_16d0b9882145d7d5a0cfa352a2d"`,
    );
    await queryRunner.query(`DROP TABLE "role_setting"`);
    await queryRunner.query(`DROP TYPE "public"."role_setting_module_enum"`);
  }
}
