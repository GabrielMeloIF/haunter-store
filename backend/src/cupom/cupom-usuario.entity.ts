import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cupom } from './cupom.entitity';

@Entity('cupomusuario')
export class CupomUsuario {
  @PrimaryGeneratedColumn()
  id_cupom_usuario!: number;

  @Column()
  id_usuario!: number;

  @Column()
  id_cupom!: number;

  @Column({ default: false })
  utilizado!: boolean;

  @Column({ type: 'datetime', nullable: true })
  utilizado_em!: Date | null;

  @ManyToOne(() => Cupom, (c) => c.cupomusuario)
  @JoinColumn({ name: 'id_cupom' })
  cupom!: Cupom;
}