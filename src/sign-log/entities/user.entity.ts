import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('utilisateurs') // Nom de la table dans la base de données
export class User {
 
@PrimaryGeneratedColumn() // Déclare cette colonne comme clé primaire auto-incrémentée
  id: number;

  @Column()
  username: string; // Référence à l'utilisateur

  @Column()
  email: string //email
  @Column()
  mot_de_passe: string; // Date et heure de la connexion

  @Column()
  prenom: string;

  @Column()
  nom: string;

  @Column()
  numero_de_tel: string;

  /*@Column()
  profile : string*/
  
}