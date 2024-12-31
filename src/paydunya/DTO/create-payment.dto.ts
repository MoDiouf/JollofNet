import { IsArray, IsNumber, IsString } from 'class-validator';

class CreateInvoiceDto {
  @IsArray()
  items: { name: string; quantity: number; unitPrice: number; totalPrice: number; description: string }[];

  @IsNumber()
  totalAmount: number;

  @IsString()
  description: string;
}
