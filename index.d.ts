// @types/index.d.ts

import { Request } from 'express';
import { Customer } from './src/customers/customer.model';

declare global {
  namespace Express {
    interface Request {
      user?: Customer // Define your custom object type here
    }
  }
}
