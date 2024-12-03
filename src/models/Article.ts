import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { Tag } from './Tag';

@Entity()
export class Article {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column()
    author!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @Column({ type: 'enum', enum: ['published', 'draft', 'archived'] })
    status!: string;

    @Column()
    views!: number;

    @ManyToMany(() => Tag, (tag) => tag.articles, { cascade: true })
    @JoinTable()
    tags!: Tag[];
}
