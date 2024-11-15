
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('modemInfo') // Nom de la table dans la base de données
export class ModemInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  utilisateur_id: number; // Référence à l'utilisateur

  @Column()
  modem_username: string; // Date et heure de la connexion

  @Column()
  modem_mot_de_passe: string; // Action (ex: "connexion", "déconnexion")

  @Column()
  gains: number;
}
