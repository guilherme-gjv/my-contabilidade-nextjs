interface InvoiceModalProps {
  invoice: IInvoice;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ invoice }) => {
  console.log("modal data: ");
  console.log(invoice);

  return (
    <div className="fixed z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-96 h-52 p-4 rounded-lg shadow-lg">
      <h2 className="font-bold">Nota Fiscal</h2>
      <p>{invoice.id}</p>
      <p>{invoice.description}</p>
      <p>{invoice.enterpriseCnpj}</p>
    </div>
  );
};

export default InvoiceModal;
