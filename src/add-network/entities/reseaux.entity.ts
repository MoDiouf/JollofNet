import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('reseaux_modem')
export class ReseauInfo {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    modem_id: number; 
  
    @Column()
    essid: string; 
  
    @Column()
    encryption_type: string; 
  
    @Column()
    password: string;

    @Column()
    prix_unitaire:number
    @Column({ type: 'text', nullable: true })
    qrCode: string;  // Si vous stockez le QR code sous forme de chaîne (base64 ou URL)

    @Column({ type: 'boolean', default: false })
    payant: boolean;
  }