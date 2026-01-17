import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrdersService } from './purchase-orders.service';
import { PurchaseOrdersController } from './purchase-orders.controller';
import { PurchaseOrder } from './purchase-order.entity';
import { Vendor } from '../vendors/vendor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseOrder, Vendor])],
  controllers: [PurchaseOrdersController],
  providers: [PurchaseOrdersService],
})
export class PurchaseOrdersModule {}

