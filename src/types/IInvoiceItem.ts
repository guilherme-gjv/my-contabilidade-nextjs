interface IInvoiceItem {
  id?: number;
  invoiceId?: number;
  price: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}
