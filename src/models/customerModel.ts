import { Schema, model, Model } from "mongoose";

export interface ICustomer {
  name: string,
  isGold: boolean,
  phone: string
}

export type CustomerModel = Model<ICustomer, {}>

const customerSchema = new Schema<ICustomer, CustomerModel>({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  isGold: {
    type: Boolean,
    default: false
  },
  phone: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  }
});

export const Customer = model<ICustomer, CustomerModel>('Customer', customerSchema);
