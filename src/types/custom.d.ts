import { Customer } from "src/customers/customer.model";


declare module 'express' {
    interface Request {
      user:any; // Replace 'User' with the actual type of your 'user' property
    }
}