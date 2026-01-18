import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum VendorStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity()
export class Vendor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  contactPerson: string;

  @Column()
  phone: string;

  @Column({
    type: 'int',
    comment: 'Payment terms in days (7, 15, 30, 45, 60)',
  })
  paymentTerms: number;

  @Column({
    type: 'enum',
    enum: VendorStatus,
    default: VendorStatus.ACTIVE,
  })
  status: VendorStatus;

  @CreateDateColumn()
  createdAt: Date;
}
