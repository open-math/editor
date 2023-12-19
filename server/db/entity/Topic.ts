import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Topic
{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('integer')
    userId: number;

    @Column('varchar')
    title: string;

    @Column('varchar', { default: '' })
    desc: string;

    @Column('varchar', { default: '' })
    tags: string;

    @Column('varchar', { default: '' })
    contributors: string;

    @Column('varchar', { default: '' })
    macros: string;

    @Column('varchar', { default: '' })
    article: string;

    @Column('varchar', { default: '' })
    summary: string;

    @Column('varchar', { default: '' })
    practicum: string;

    @Column('simple-json', { nullable: true })
    assets: object;

    @Column('boolean', { default: true })
    private: boolean;

    @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    lastEdit: string;
}