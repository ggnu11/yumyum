import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameUserColumns1759578127420 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameColumn('place', 'phone', 'phoneNumber');
        await queryRunner.renameColumn('place', 'road_address_name', 'roadAddress');
        await queryRunner.renameColumn('place', 'category_group_name', 'categoryGroupName');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameColumn('place', 'phoneNumber', 'phone');
        await queryRunner.renameColumn('place', 'roadAddress', 'road_address_name');
        await queryRunner.renameColumn('place', 'categoryGroupName', 'category_group_name');
    }

}
