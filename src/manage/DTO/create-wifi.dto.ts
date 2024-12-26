import { Transform } from 'class-transformer';
import {
  IsString,
  IsIn,
  IsOptional,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class CreateWifiDto {
  @IsString()
  @IsNotEmpty()
  nomReseau: string;

  @IsIn(['public', 'private'])
  networkVisibility: string;

  @IsIn(['2.4', '5'])
  networkFrequency: string;

  @IsIn(['WPA2-PSK-AES', 'WPA2/WPA3-SAE', 'WPA3', 'WPA/WPA2-PSK-AES', 'None'])
  @IsOptional()
  networkSecurity?: string;

  @IsIn(['free', 'paid'])
  networkPayment: string;

  @Transform(({ value }) => {
    if (value === null || value === undefined || value === '') {
      return 0; // Si la valeur est vide, null ou undefined, on retourne 0
    }
    const parsedValue = parseFloat(value); // Convertir en nombre
    return isNaN(parsedValue) ? 0 : parsedValue; // Si la valeur n'est pas valide, on retourne 0
  }, { toClassOnly: true })
  @IsNumber({}, { message: 'Prix doit être un nombre valide.' })
  @IsOptional()
  prix: number;
  
  
  

  @Transform(({ value }) => value === 'on', { toClassOnly: true })
  @IsBoolean()
  @IsOptional()
  scannable: boolean;

  @IsString()
  @IsOptional()
  macAddress1?: string;

  @IsString()
  @IsOptional()
  macAddress2?: string;

  @IsString()
  @IsOptional()
  macAddress3?: string;

  @IsString()
  @IsOptional()
  macAddress4?: string;

  @IsString()
  @IsOptional()
  macAddress5?: string;

  @IsString()
  @IsOptional()
  macAddress6?: string;

  @IsString()
  @IsNotEmpty()
  newpasseword: string;
}
