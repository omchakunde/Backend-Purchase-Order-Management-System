import { IsNumber, IsPositive } from 'class-validator';

export class CreatePurchaseOrderDto {
  @IsNumber()
  vendorId: number;

  @IsNumber()
  @IsPositive()
  totalAmount: number;
}
