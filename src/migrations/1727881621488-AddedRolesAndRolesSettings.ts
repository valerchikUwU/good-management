import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedRolesAndRolesSettings1727881621488
  implements MigrationInterface
{
  name = 'AddedRolesAndRolesSettings1727881621488';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."role_settings_module_enum" AS ENUM('policy', 'goal', 'objective', 'strategy', 'project', 'post', 'statistic')`,
    );
    await queryRunner.query(
      `CREATE TABLE "role_settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "module" "public"."role_settings_module_enum" NOT NULL, "can_read" boolean NOT NULL DEFAULT false, "can_create" boolean NOT NULL DEFAULT false, "can_update" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "roleId" uuid, CONSTRAINT "REL_e0c4af45a9ba076c9a438575eb" UNIQUE ("roleId"), CONSTRAINT "PK_f69fed4c1166e561a826f3bfe93" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."role_rolename_enum" AS ENUM('Собственник', 'Админ', 'Помощник', 'Директор', 'Руководитель', 'Сотрудник')`,
    );
    await queryRunner.query(
      `CREATE TABLE "role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "roleName" "public"."role_rolename_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "roleId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "role_settings" ADD CONSTRAINT "FK_e0c4af45a9ba076c9a438575eb2" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_settings" DROP CONSTRAINT "FK_e0c4af45a9ba076c9a438575eb2"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "roleId"`);
    await queryRunner.query(`DROP TABLE "role"`);
    await queryRunner.query(`DROP TYPE "public"."role_rolename_enum"`);
    await queryRunner.query(`DROP TABLE "role_settings"`);
    await queryRunner.query(`DROP TYPE "public"."role_settings_module_enum"`);
  }
}
