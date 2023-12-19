import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class User
{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('boolean')
    confirmed: boolean;

    @Column('varchar', { unique: true })
    email: string;

    @Column('varchar')
    login: string;

    @Column('varchar')
    salt: string;

    @Column('varchar')
    hash: string;

    //
    //
    //

    @Column('boolean', { default: false })
    isEditor: boolean;
}