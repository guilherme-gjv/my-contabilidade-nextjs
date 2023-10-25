interface IInvoice {
  id: number;
  userId: number;
  enterpriseCnpj?: string;
  description?: string;
  items: IInvoiceItem[];
  createdAt: string;
  updatedAt: string;
}
