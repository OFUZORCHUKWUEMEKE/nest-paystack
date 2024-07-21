export interface ITransferRecipient {
    type: string;
    name: string;
    account_number: string;
    bank_code: string;
    currency: string;
    user_id: string;
  }

export interface Transferdto{
    recipient: string,
     amount: number
}