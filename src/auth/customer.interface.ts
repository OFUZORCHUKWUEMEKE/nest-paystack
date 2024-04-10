
import { Request } from 'express';
import { Customer } from 'src/customers/customer.model';


interface RequestWithUser extends Request {
    user: Customer;
}

export default RequestWithUser;