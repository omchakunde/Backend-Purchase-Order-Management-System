import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { VendorsModule } from './vendors/vendors.module';
import { PurchaseOrdersModule } from './purchase-orders/purchase-orders.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',

      // ✅ THIS IS THE MOST IMPORTANT LINE
      url: process.env.DATABASE_URL,

      // ✅ REQUIRED FOR RENDER POSTGRES
      ssl: {
        rejectUnauthorized: false,
      },

      autoLoadEntities: true,
      synchronize: true,
    }),

    VendorsModule,
    PurchaseOrdersModule,
    PaymentsModule,
  ],
})
export class AppModule {}
