import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseOrder, PurchaseOrderStatus } from './purchase-order.entity';
import { Vendor, VendorStatus } from '../vendors/vendor.entity';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';

@Injectable()
export class PurchaseOrdersService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private readonly poRepository: Repository<PurchaseOrder>,

    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
  ) {}

  async create(
    createPoDto: CreatePurchaseOrderDto,
  ): Promise<PurchaseOrder> {
    // 1️⃣ Check vendor exists
    const vendor = await this.vendorRepository.findOneBy({
      id: createPoDto.vendorId,
    });

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    // 2️⃣ Check vendor is active
    if (vendor.status === VendorStatus.INACTIVE) {
      throw new BadRequestException('Cannot create PO for inactive vendor');
    }

    const today = new Date();

    // 3️⃣ Calculate due date (poDate + paymentTerms)
    const dueDate = new Date(today);
    dueDate.setDate(dueDate.getDate() + vendor.paymentTerms);

    // 4️⃣ Generate PO number safely
    const datePart = today
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, '');

    const countToday = await this.poRepository
      .createQueryBuilder('po')
      .where('po.poNumber LIKE :date', { date: `PO-${datePart}-%` })
      .getCount();

    const poNumber = `PO-${datePart}-${String(countToday + 1).padStart(
      3,
      '0',
    )}`;

    // 5️⃣ Create Purchase Order
    const purchaseOrder = this.poRepository.create({
      poNumber,
      vendor,
      poDate: today,
      dueDate,
      totalAmount: createPoDto.totalAmount,
      status: PurchaseOrderStatus.DRAFT,
    });

    // 6️⃣ Save & return
    return this.poRepository.save(purchaseOrder);
  }

  async findAll(): Promise<PurchaseOrder[]> {
    return this.poRepository.find();
  }

  async findOne(id: number): Promise<PurchaseOrder> {
    const po = await this.poRepository.findOneBy({ id });

    if (!po) {
      throw new NotFoundException('Purchase order not found');
    }

    return po;
  }
}
