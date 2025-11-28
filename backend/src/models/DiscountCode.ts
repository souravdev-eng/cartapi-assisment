import mongoose, { Schema, Document } from 'mongoose';


export interface IDiscountCode extends Document {
  code: string;
  discountPercent: number;
  isUsed: boolean;
  orderNumber?: number;
  usedByOrderNumber?: number;
  createdAt: Date;
  usedAt?: Date;
}

const DiscountCodeSchema: Schema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    discountPercent: {
      type: Number,
      required: true,
      default: 10,
    },
    isUsed: {
      type: Boolean,
      default: false,
      index: true,
    },
    orderNumber: {
      type: Number,
      default: null,
    },
    usedByOrderNumber: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IDiscountCode>('DiscountCode', DiscountCodeSchema);

