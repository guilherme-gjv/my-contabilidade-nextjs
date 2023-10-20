interface IInvoice {
  id: number;
  userId: number;
  enterpriseCnpj?: string;
  description?: string;
  items: any[];
  createdAt: string;
  updatedAt: string;
}
