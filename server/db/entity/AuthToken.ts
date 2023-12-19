import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export default class AuthToken
{
    @PrimaryColumn('varchar')
    token: string;

    @Column('int')
    userId: number;

    @Column('int')
    expires: number;
}