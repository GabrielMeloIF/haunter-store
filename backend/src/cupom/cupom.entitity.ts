import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { CupomUsuario } from './cupom-usuario.entity';

@Entity('cupom')
export class Cupom {
  @PrimaryGeneratedColumn()
  id_cupom!: number;

  @Column({ unique: true })
  codigo!: string;

  @Column({ type: 'text' })
  descricao!: string;

  @Column({ type: 'float' })
  desconto!: number;

  @Column({ type: 'datetime' })
  validade!: Date;

  @CreateDateColumn()
  criado_em!: Date;

  @OneToMany(() => CupomUsuario, (cu) => cu.cupom)
  cupomusuario!: CupomUsuario[];
}