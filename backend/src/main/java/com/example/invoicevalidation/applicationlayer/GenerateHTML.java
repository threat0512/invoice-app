package com.example.invoicevalidation.applicationlayer;

import java.util.*;
import com.example.invoicevalidation.reponseobjs.AssertionError;
import com.example.invoicevalidation.reponseobjs.FiredAssertionErrors;
// import com.example.invoicevalidation.reponseobjs.FiredAssertionErrors;
import com.example.invoicevalidation.reponseobjs.PeppolUBLRuleResponse;
import com.example.invoicevalidation.reponseobjs.ValidationResponse;

public class GenerateHTML {
    /**
     * produces a string containing the entire html
     * @param response  results of the validation reporot
     * @param xmlData
     * @return
     */

    public static void main(String[] args) {
        GenerateHTML g = new GenerateHTML();
        ValidationResponse r = new ValidationResponse(true, "reason", "details");

        List < AssertionError > al1 = new ArrayList < > () {
            {
                add(new AssertionError("1", "test", "description", "severity"));
                add(new AssertionError("2", "test", "description", "severity"));
            }
        };

        List < AssertionError > al2 = new ArrayList < > () {
            {
                add(new AssertionError("3", "test", "description", "severity"));
                add(new AssertionError("4", "test", "description", "severity"));
            }
        };

        FiredAssertionErrors fae = new FiredAssertionErrors(al1, al2);
        PeppolUBLRuleResponse p = new PeppolUBLRuleResponse(false, "reason", fae);

        System.out.println(g.generateHTML(r, p, ""));
    }

    public String generateHTML(ValidationResponse validationResponse, PeppolUBLRuleResponse peppolUBLresponse, String xmlData) {
        // form html as string
        String content = this.boilerPlateTop();
        if (validationResponse != null && !validationResponse.isSuccessful()) {
            content += "    <p>The e-invoice has failed some prelimary checks</p>\n";
            content += "    <p>reason: " + validationResponse.getReason() + "</p>\n";
            content += "    <p>details: " + validationResponse.getDetails() + "</p>\n";
            return content + this.boilerPlateBottom(xmlData);
        }

        if (peppolUBLresponse != null && !peppolUBLresponse.isSuccessful()) {
            // get errors
            List < AssertionError > peppol = peppolUBLresponse.getFiredAssertionErrors().getAUNZ_PEPPOL_1_1_10();
            List < AssertionError > ubl = peppolUBLresponse.getFiredAssertionErrors().getAUNZ_UBL_1_1_10();

            System.out.println(peppol);
            System.out.println(ubl);

            // add failure message
            content +=
                "    <p>\n" +
                "      The e-invoice violates business rules<br></br>\n" +
                "      The following was violated:\n" +
                "    </p>\n" +
                "    <ul>\n";

            if (!peppol.isEmpty()) {
                content += "      <li>PEPPOL Rules (<a href=\"https://github.com/A-NZ-PEPPOL/A-NZ-PEPPOL-BIS-3.0/tree/master/Specifications\">AUNZ business rules (appendix B, PEPPOL rules, page 70)</a>)</li>";
            }

            if (!ubl.isEmpty()) {
                content += "      <li>Syntax Rules (<a href=\"https://github.com/A-NZ-PEPPOL/A-NZ-PEPPOL-BIS-3.0/tree/master/Specifications\">EN16931 business rules (appendix B, BR rules, page 44)</a>)</li>";
            }

            content +=
                "    </ul>\n" +
                "    <h2>Violations</h2>\n";

            // check PEPPOL
            if (!peppol.isEmpty()) {
                content += "    <h3>from PEPPOL rules</h3>\n";
                for (AssertionError error: peppol) {
                    content += this.createError(error);
                }
            }

            // check UBL
            if (!ubl.isEmpty()) {
                content += "    <h3>from UBL</h3>\n";
                for (AssertionError error: ubl) {
                    content += this.createError(error);
                }
            }
            return content + this.boilerPlateBottom(xmlData);
        }

        content += "    <p>The e-invoice has passed validation.</p>\n";
        return content + this.boilerPlateBottom(xmlData);
    }

    /**
     * Produces the start of a HTML format
     * @return  the start of a HTML boiler plate
     */
    private String boilerPlateTop() {
        return "<!DOCTYPE html>\n" +
            "<html lang=\"en\">\n" +
            "  <head>\n" +
            "    <title>Validation Report</title>\n" +
            "  </head>\n" +
            "\n" +
            "  <body>\n" +
            "    <h1>Results</h1>\n";
    }

    /**
     * Produces the end of a HTML format.
     * Includes raw e-invoice
     * @param   xmlData string of the e-invoice
     * @return          the end of a HTML boilerplate
     */
    private String boilerPlateBottom(String xmlData) {
        if (xmlData.equals("")) return "<h1>invoice preview not avaliable in PDF</h1>" +
            "  </body>\n" +
            "</html>";

        return "<h1>Your Invoice </h1>\n" +
            "    <textarea rows=\"25\" cols=\"150\">\n" +
            xmlData +
            "    </textarea>\n" +
            "  </body>\n" +
            "</html>";
    }

    /**
     * Produces an error message
     * @param   error   the AssertionError containing details of the error
     * @return          the error formatted in HTML
     */
    private String createError(AssertionError error) {
        return "    <div class=\"error\">\n" +
            "      <p>Id: " + error.getId() + "</p>\n" +
            "      <p>Test: " + error.getTest() + "</p>\n" +
            "      <p>Description: " + error.getDescription() + "</p>\n" +
            "      <p>Severity: " + error.getSeverity() + "</p>\n" +
            "    </div>\n";
    }
}