import { IsArray, IsNumber, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class InvoiceItem {
  @IsNotEmpty()
  name: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unitPrice: number;

  @IsNumber()
  totalPrice: number;

  @IsNotEmpty()
  description: string;
}

export class CreateInvoiceDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceItem)
  items: InvoiceItem[];

  @IsNumber()
  totalAmount: number;
}
