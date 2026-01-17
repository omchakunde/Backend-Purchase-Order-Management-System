import { IsNumber, IsPositive } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  purchaseOrderId: number;

  @IsNumber()
  @IsPositive()
  amount: number;
}
