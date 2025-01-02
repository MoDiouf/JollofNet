import { IsNumber, IsString, Min } from 'class-validator';

export class CreateTransferDto {
  totalPayment: number;
  apiKey: string;
  myOrangeMoneyAccount: string;
  otherOrangeMoneyAccount: string;
}

  