import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('listClient')
export class ListClient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column({ name: 'mac_address' })
  macAddress: string;

  @Column({ name: 'created_at',type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
