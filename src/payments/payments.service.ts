import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { PurchaseOrder, PurchaseOrderStatus } from '../purchase-orders/purchase-order.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    @InjectRepository(PurchaseOrder)
    private readonly poRepository: Repository<PurchaseOrder>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const po = await this.poRepository.findOneBy({
      id: createPaymentDto.purchaseOrderId,
    });

    if (!po) {
      throw new NotFoundException('Purchase order not found');
    }

    if (po.status === PurchaseOrderStatus.PAID) {
      throw new BadRequestException('Purchase order already fully paid');
    }

    const payment = this.paymentRepository.create({
      purchaseOrder: po,
      amount: createPaymentDto.amount,
    });

    const savedPayment = await this.paymentRepository.save(payment);

    // Calculate total paid amount
    const payments = await this.paymentRepository.find({
      where: { purchaseOrder: { id: po.id } },
    });

    const totalPaid = payments.reduce(
      (sum, p) => sum + Number(p.amount),
      0,
    );

    // Update PO status
    if (totalPaid >= Number(po.totalAmount)) {
      po.status = PurchaseOrderStatus.PAID;
    } else {
      po.status = PurchaseOrderStatus.PARTIALLY_PAID;
    }

    await this.poRepository.save(po);

    return savedPayment;
  }
}

