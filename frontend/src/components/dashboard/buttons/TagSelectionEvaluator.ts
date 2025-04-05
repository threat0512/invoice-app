import { EInvoiceItem } from "../../../data";

/**
 * given a e-invoice with a list of tags and selection string,
 * return whether the tags matches the selectionString
 * @param invoice 
 * @param selectionString 
 */
export function evaluateString(invoice: EInvoiceItem, selectionString: string) {
  if (selectionString == '') {
    return 'true'
  }


  const tags = invoice.tags;
  // selectionString = (AB,BD,CD|D,E,F,G)|(H,I)
  // console.log(tags)
  let evalStr = ''
  while (selectionString != '') {
    // eat up whitespace
    let ws = selectionString.match(/^\s+/)
    if (ws) {
      selectionString = selectionString.slice(ws[0].length)
      continue
    }

    let v = selectionString.match(/^[A-Z0-9_-]+/)
    if (v) {
      let variable = v[0]
      if (tags.includes(variable)) {
        evalStr += 'true '
      } else {
        evalStr += 'false '
      }
      
      selectionString = selectionString.slice(variable.length)
      continue
    }


    if (selectionString[0] == '(') {
      evalStr += '( ';
      selectionString = selectionString.slice(1)
    } else if (selectionString[0] == ')') {
      evalStr += ') '
      selectionString = selectionString.slice(1)
    } else if (selectionString[0] == ',') {
      evalStr += '&& '
      selectionString = selectionString.slice(1)
    } else if (selectionString[0] == '|') {
      evalStr += '|| '
      selectionString = selectionString.slice(1)
    }
  }

  try {
    const res = eval(evalStr)
    return res.toString()
  } catch(err) {
    return 'invalid'
  }
  

}