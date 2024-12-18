import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('user_Connected')  
export class UserConnected {
  
  @PrimaryGeneratedColumn({ name: 'entry_id' })  
  entryId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })  
  gain: number;

  @Column({ type: 'int' }) 
  number_connected: number;

  @Column({ type: 'date' })  
  month_year: string;

  @Column({ type: 'int', nullable: true }) 
  id?: number;
}
