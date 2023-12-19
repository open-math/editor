import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export default class UserConfirm
{
    @PrimaryColumn('int')
    userId: number;

    @Column('varchar')
    confirmKey: string;

    @Column('int')
    expires: number;
}