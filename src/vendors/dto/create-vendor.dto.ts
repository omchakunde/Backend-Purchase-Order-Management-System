import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { VendorStatus } from '../vendor.entity';

export class CreateVendorDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  contactPerson: string;

  @IsNotEmpty()
  phone: string;

  @IsNumber()
  paymentTerms: number;

  @IsEnum(VendorStatus)
  status: VendorStatus;
}
