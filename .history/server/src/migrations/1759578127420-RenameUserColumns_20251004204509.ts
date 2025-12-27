import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameUserColumns1759578127420 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameColumn('user', 'createdAt', 'created_at');
        await queryRunner.renameColumn('user', 'updatedAt', 'roadAddress');
        await queryRunner.renameColumn('user', 'deletedAt', 'categoryGroupName');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameColumn('user', 'phoneNumber', 'createdAt');
        await queryRunner.renameColumn('user', 'roadAddress', 'updatedAt');
        await queryRunner.renameColumn('user', 'categoryGroupName', 'deletedAt');
    }

}
