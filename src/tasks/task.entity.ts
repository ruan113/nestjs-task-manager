import { Exclude } from 'class-transformer';
import { User } from 'src/auth/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from './task-status.enum';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;

  // o segundo parametro nada mais é você especificando como a outra parte vai acessar essa entidade
  // o eager representa que o lada que possui o eager igual a true numa relação, ao ser requisitado no banco, o atributo relacionado será retornado junto
  // nesse caso, se selecionarmos um User, ele vira com as tasks quando fizermos o select
  // enquanto em task, quando selecionamor uma task, ela não vira com User, pois o eager dela é false.
  @ManyToOne((_type) => User, (user) => user.tasks, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;
}
