export type InvoiceItem = {
  ID: string;
  UnitCode: string; // https://docs.peppol.eu/poacc/billing/3.0/codelist/UNECERec20/
  UnitPrice: string;
  InvoicedQuantity: string;
  ItemName: string;
};

export type CreationFormData = {
  BuyerReference?: string;
  InvoiceID?: string; // internal id to be used by your company
  IssueDate?: string;
  DueDate?: string;
  // fix currencycode at AUD

  // ACCOUNTING SUPPLIER PARTY
  AccountingSupplierPartyPartyName?: string;
  AccountingSupplierPartyStreetName?: string;
  AccountingSupplierPartyAdditionalStreetName?: string;
  AccountingSupplierPartyCityName?: string;
  AccountingSupplierPartyPostalZone?: string;
  AccountingSupplierPartyCountry?: "AU" | "NZ"; // AU or NZ
  AccountingSupplierPartyRegistrationName?: string;
  AccountingSupplierPartyCompanyID?: string; // if AU, then it is ABN (11 digits) if NZ, it is NZBN (13 digits)

  // ACCOUNTING CUSTOMER PARTY
  AccountingCustomerPartyPartyName?: string;
  AccountingCustomerPartyStreetName?: string;
  AccountingCustomerPartyAdditionalStreetName?: string;
  AccountingCustomerPartyCityName?: string;
  AccountingCustomerPartyPostalZone?: string;
  AccountingCustomerPartyCountry?: "AU" | "NZ"; // AU or NZ
  AccountingCustomerPartyRegistrationName?: string;
  AccountingCustomerPartyCompanyID?: string; // if AU, then it is ABN (11 digits) if NZ, it is NZBN (13 digits)
  InvoiceLines: InvoiceItem[];
};

export const sampleData:CreationFormData = {
  BuyerReference: 'ORDER42069',
  InvoiceID: 'YOU_OWE_ME_MONEY_1', // internal id to be used by your company
  IssueDate: '2020-10-02',
  DueDate: '2020-12-20',
  // fix currencycode at AUD

  // ACCOUNTING SUPPLIER PARTY
  AccountingSupplierPartyPartyName: 'Heisenberg',
  AccountingSupplierPartyStreetName: '3828 Piermont',
  AccountingSupplierPartyAdditionalStreetName: 'Dr Albuquerque NM',
  AccountingSupplierPartyCityName: 'Sydney',
  AccountingSupplierPartyPostalZone: '2000',
  AccountingSupplierPartyCountry: 'AU', // AU or NZ
  AccountingSupplierPartyRegistrationName: 'Walter White Productions Inc',
  AccountingSupplierPartyCompanyID: '47555222000', // if AU, then it is ABN if NZ, it is NZBN

  // ACCOUNTING CUSTOMER PARTY
  AccountingCustomerPartyPartyName: 'Tocu Salamanca\'s dough',
  AccountingCustomerPartyStreetName: 'Trusty Shed',
  AccountingCustomerPartyAdditionalStreetName: 'Somewhere',
  AccountingCustomerPartyCityName: 'Sydney',
  AccountingCustomerPartyPostalZone: '2033',
  AccountingCustomerPartyCountry: 'AU', // AU or NZ
  AccountingCustomerPartyRegistrationName: 'Tocu Salamanca Productions Inc',
  AccountingCustomerPartyCompanyID: '47555222000', // if AU, then it is ABN if NZ, it is NZBN
  InvoiceLines: [
    {
      ID: '1',
      UnitCode: 'KGM', // https://docs.peppol.eu/poacc/billing/3.0/codelist/UNECERec20/
      UnitPrice: '420.00',
      InvoicedQuantity: '10',
      ItemName: 'White Rock Candy',
    },
    {
      ID: '2',
      UnitCode: 'KGM', // https://docs.peppol.eu/poacc/billing/3.0/codelist/UNECERec20/
      UnitPrice: '690.00',
      InvoicedQuantity: '10',
      ItemName: 'Blue Rock Candy',
    }
  ],
}


export const empty = {
  BuyerReference: '',
  InvoiceID: '', // internal id to be used by your company
  IssueDate: '',
  DueDate: '',
  // fix currencycode at AUD

  // ACCOUNTING SUPPLIER PARTY
  AccountingSupplierPartyPartyName: '',
  AccountingSupplierPartyStreetName: '',
  AccountingSupplierPartyAdditionalStreetName: '',
  AccountingSupplierPartyCityName: '',
  AccountingSupplierPartyPostalZone: '',
  AccountingSupplierPartyCountry: '', // AU or NZ
  AccountingSupplierPartyRegistrationName: '',
  AccountingSupplierPartyCompanyID: '', // if AU, then it is ABN if NZ, it is NZBN

  // ACCOUNTING CUSTOMER PARTY
  AccountingCustomerPartyPartyName: '',
  AccountingCustomerPartyStreetName: '',
  AccountingCustomerPartyAdditionalStreetName: '',
  AccountingCustomerPartyCityName: '',
  AccountingCustomerPartyPostalZone: '',
  AccountingCustomerPartyCountry: '', // AU or NZ
  AccountingCustomerPartyRegistrationName: '',
  AccountingCustomerPartyCompanyID: '', // if AU, then it is ABN if NZ, it is NZBN
  InvoiceLines: [
    {
      ID: 1,
      UnitCode: '', // https://docs.peppol.eu/poacc/billing/3.0/codelist/UNECERec20/
      UnitPrice: '',
      InvoicedQuantity: '',
      ItemName: '',
    },
    {
      ID: 1,
      UnitCode: '', // https://docs.peppol.eu/poacc/billing/3.0/codelist/UNECERec20/
      UnitPrice: '',
      InvoicedQuantity: '',
      ItemName: '',
    }
  ],
  GSTPercent: 10,
}