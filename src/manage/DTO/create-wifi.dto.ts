import { Transform } from 'class-transformer';
import { IsString, IsIn, IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';

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
