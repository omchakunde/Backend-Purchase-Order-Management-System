import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Vendor } from '../vendors/vendor.entity';

export enum PurchaseOrderStatus {
  DRAFT = 'Draft',
  APPROVED = 'Approved',
  PARTIALLY_PAID = 'Partially Paid',
  PAID = 'Paid',
}

@Entity()
export class PurchaseOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  poNumber: string;

  @ManyToOne(() => Vendor, { eager: true })
  vendor: Vendor;

  @CreateDateColumn()
  poDate: Date;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalAmount: number;

  @Column({
    type: 'enum',
    enum: PurchaseOrderStatus,
    default: PurchaseOrderStatus.DRAFT,
  })
  status: PurchaseOrderStatus;
}
