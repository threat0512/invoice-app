import convert from 'xml-js';

const sampleInputData = {
  BuyerReference: '123456',
  InvoiceID: '01', // internal id to be used by your company
  IssueDate: '2020-10-02',
  DueDate: '2020-12-20',
  // fix currencycode at AUD

  // ACCOUNTING SUPPLIER PARTY
  AccountingSupplierPartyPartyName: 'seller name',
  AccountingSupplierPartyStreetName: '1',
  AccountingSupplierPartyAdditionalStreetName: '1',
  AccountingSupplierPartyCityName: '1',
  AccountingSupplierPartyPostalZone: '2033',
  AccountingSupplierPartyCountry: 'NZ', // AU or NZ
  AccountingSupplierPartyRegistrationName: 'seller official name',
  AccountingSupplierPartyCompanyID: '9429040298443', // if AU, then it is ABN if NZ, it is NZBN

  // ACCOUNTING CUSTOMER PARTY
  AccountingCustomerPartyPartyName: 'buyer name',
  AccountingCustomerPartyStreetName: '1',
  AccountingCustomerPartyAdditionalStreetName: '1',
  AccountingCustomerPartyCityName: '1',
  AccountingCustomerPartyPostalZone: '2033',
  AccountingCustomerPartyCountry: 'AU', // AU or NZ
  AccountingCustomerPartyRegistrationName: 'buyer official name',
  AccountingCustomerPartyCompanyID: '47555222000', // if AU, then it is ABN if NZ, it is NZBN
  InvoiceLines: [
    {
      ID: 1,
      UnitCode: 'KGM', // https://docs.peppol.eu/poacc/billing/3.0/codelist/UNECERec20/
      UnitPrice: '299.94',
      InvoicedQuantity: '10',
      ItemName: 'item type 1',
    },
    {
      ID: 1,
      UnitCode: 'KGM', // https://docs.peppol.eu/poacc/billing/3.0/codelist/UNECERec20/
      UnitPrice: '111.11',
      InvoicedQuantity: '10',
      ItemName: 'item type 2',
    }
  ],
  GSTPercent: 10,
}

function getSchemeId(country) {
  if (country == 'AU') return '0151'
  if (country == 'NZ') return '0088'
  return 'unknown'
}

function getGSTRate(country) {
  if (country == 'AU') return 10;
  if (country == 'NZ') return 15;
}

export function convertDataToInvoice(inputData) {
  const supplierSchemeID = getSchemeId(inputData.AccountingSupplierPartyCountry)
  const customerSchemeID = getSchemeId(inputData.AccountingCustomerPartyCountry)

  let invoice = {
    _declaration: { _attributes: { version: '1.0', encoding: 'UTF-8' } },
    Invoice: {
      _attributes: {
        'xmlns:cac': 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
        'xmlns:cbc': 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
        xmlns: 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2'
      },
      'cbc:CustomizationID': {
        _text: 'urn:cen.eu:en16931:2017#conformant#urn:fdc:peppol.eu:2017:poacc:billing:international:aunz:3.0'
      },
      'cbc:ProfileID': { _text: 'urn:fdc:peppol.eu:2017:poacc:billing:01:1.0' },
      'cbc:ID': { _text: inputData.InvoiceID }, // input
      'cbc:IssueDate': { _text: inputData.IssueDate }, // input
      'cbc:DueDate': { _text: inputData.DueDate }, // input
      'cbc:InvoiceTypeCode': { _text: '380' },
      'cbc:DocumentCurrencyCode': { _text: 'AUD' },
      'cbc:BuyerReference': { _text: inputData.BuyerReference },
  
      "cac:AccountingSupplierParty": {
        "cac:Party": {
          "cbc:EndpointID": {
            "_attributes": { "schemeID": supplierSchemeID },
            "_text": inputData.AccountingSupplierPartyCompanyID
          },
          "cac:PartyName": {
            "cbc:Name": { "_text": inputData.AccountingSupplierPartyPartyName }
          },
          "cac:PostalAddress": {
            "cbc:StreetName": { "_text": inputData.AccountingSupplierPartyStreetName },
            "cbc:AdditionalStreetName": { "_text": inputData.AccountingSupplierPartyAdditionalStreetName },
            "cbc:CityName": { "_text": inputData.AccountingSupplierPartyCityName },
            "cbc:PostalZone": { "_text": inputData.AccountingSupplierPartyPostalZone },
            "cac:Country": { "cbc:IdentificationCode": { "_text": inputData.AccountingSupplierPartyCountry } }
          },
  
          "cac:PartyLegalEntity": {
            "cbc:RegistrationName": { "_text": inputData.AccountingSupplierPartyRegistrationName },
            "cbc:CompanyID": {
              "_attributes": { "schemeID": supplierSchemeID },
              "_text": inputData.AccountingSupplierPartyCompanyID
            }
          }
        }
      },
  
      "cac:AccountingCustomerParty": {
        "cac:Party": {
          "cbc:EndpointID": {
            "_attributes": { "schemeID": customerSchemeID },
            "_text": inputData.AccountingCustomerPartyCompanyID
          },
          "cac:PartyName": { "cbc:Name": { "_text": inputData.AccountingCustomerPartyPartyName } },
          "cac:PostalAddress": {
            "cbc:StreetName": { "_text": inputData.AccountingCustomerPartyStreetName },
            "cbc:AdditionalStreetName": { "_text": inputData.AccountingCustomerPartyAdditionalStreetName },
            "cbc:CityName": { "_text": inputData.AccountingCustomerPartyCityName },
            "cbc:PostalZone": { "_text": inputData.AccountingCustomerPartyPostalZone },
            "cac:Country": { "cbc:IdentificationCode": { "_text":  inputData.AccountingCustomerPartyCountry } }
          },
          "cac:PartyLegalEntity": {
            "cbc:RegistrationName": { "_text":  inputData.AccountingCustomerPartyRegistrationName },
            "cbc:CompanyID": {
              "_attributes": { "schemeID": customerSchemeID },
              "_text":  inputData.AccountingCustomerPartyCompanyID
            }
          }
        }
      },
    }
  }
  
  // assume country is AU or NZ
  const GSTRate = getGSTRate(inputData.AccountingSupplierPartyCountry);
  let totalUntaxedAmount = 0;
  
  let invoiceLinesOut = []
  for (let invoiceLine of inputData.InvoiceLines) {
    const unitPrice = Number(invoiceLine.UnitPrice)
    const quantity = Number(invoiceLine.InvoicedQuantity)
    // calculate
    let lineExtAmount = (unitPrice * quantity)
    totalUntaxedAmount += lineExtAmount
    
    const obj = 
    {
      "cbc:ID": { "_text": invoiceLine.ID },
      "cbc:InvoicedQuantity": {
        "_attributes": { "unitCode": invoiceLine.UnitCode },
        "_text": invoiceLine.InvoicedQuantity
      },
      "cbc:LineExtensionAmount": {
        "_attributes": { "currencyID": "AUD" },
        "_text": lineExtAmount.toFixed(2)
      },
      "cac:Item": {
        "cbc:Name": { "_text": invoiceLine.ItemName },
        "cac:ClassifiedTaxCategory": {
          "cbc:ID": { "_text": "S" },
          "cbc:Percent": { "_text": GSTRate },
          "cac:TaxScheme": { "cbc:ID": { "_text": "GST" } }
        }
      },
  
      "cac:Price": {
        "cbc:PriceAmount": {
          "_attributes": { "currencyID": "AUD" },
          "_text": invoiceLine.UnitPrice
        }
      }
    }
    invoiceLinesOut.push(obj)
  }
  
  const taxedAmount = ((GSTRate / 100) * totalUntaxedAmount)
  
  invoice["Invoice"]["cac:TaxTotal"] = {
    "cbc:TaxAmount": {
      "_attributes": { "currencyID": "AUD" },
      "_text": taxedAmount.toFixed(2)
    },
    "cac:TaxSubtotal": {
      "cbc:TaxableAmount": {
        "_attributes": { "currencyID": "AUD" },
        "_text": totalUntaxedAmount.toFixed(2)
      },
      "cbc:TaxAmount": {
        "_attributes": { "currencyID": "AUD" },
        "_text": taxedAmount.toFixed(2)
      },
      "cac:TaxCategory": {
        "cbc:ID": { "_text": "S" },
        "cbc:Percent": { "_text": GSTRate },
        "cac:TaxScheme": { "cbc:ID": { "_text": "GST" } }
      }
    }
  }
  
  invoice["Invoice"]["cac:LegalMonetaryTotal"] = {
    "cbc:LineExtensionAmount": {
      "_attributes": { "currencyID": "AUD" },
      "_text": totalUntaxedAmount.toFixed(2)
    },
    "cbc:TaxExclusiveAmount": {
      "_attributes": { "currencyID": "AUD" },
      "_text": totalUntaxedAmount.toFixed(2)
    },
    "cbc:TaxInclusiveAmount": {
      "_attributes": { "currencyID": "AUD" },
      "_text": (totalUntaxedAmount + taxedAmount).toFixed(2)
    },
    "cbc:PayableAmount": {
      "_attributes": { "currencyID": "AUD" },
      "_text": (totalUntaxedAmount + taxedAmount).toFixed(2)
    }
  }
  
  invoice["Invoice"]["cac:InvoiceLine"] = invoiceLinesOut;
  const xmlData = convert.js2xml(invoice, { compact: true, spaces: 2 });
  return xmlData;
}