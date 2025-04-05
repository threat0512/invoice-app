package com.example.invoicevalidation;

import com.example.invoicevalidation.applicationlayer.ValidateAgainstXSD;
import com.example.invoicevalidation.applicationlayer.ValidateXML;
import com.example.invoicevalidation.applicationlayer.XSLTErrorGenerator;
import com.example.invoicevalidation.reponseobjs.AssertionError;
import com.example.invoicevalidation.reponseobjs.FiredAssertionErrors;
import com.example.invoicevalidation.reponseobjs.PeppolUBLRuleResponse;
import com.example.invoicevalidation.reponseobjs.ValidationResponse;

import net.sf.saxon.s9api.SaxonApiException;

import java.util.*;

public class ResponseCreator {

    public static ValidationResponse getValidationResponse(ValidateAgainstXSD xsdValidator, String xmlData) {
        String message = ValidateXML.validateXML(xmlData);
        if (message.equals("internal server error")) {
            return new ValidationResponse(false, "internal server error", "");
        }

        if (!message.equals("true")) {
            return new ValidationResponse(false, "XML is not well formed", message);
        }

        String message2 = xsdValidator.validateXMLAgainstXSD(xmlData);
        if (message2.equals("internal server error")) {
            return new ValidationResponse(false, "internal server error", "");
        }

        if (!message2.equals("true")) {
            return new ValidationResponse(false, "XML failed schema validation", message2);
        }

        return new ValidationResponse(true, "", "");
    }


    /**
     * given the
     * @param xmlData
     * @return
     */
    public static PeppolUBLRuleResponse getPeppolUblResponseObject(XSLTErrorGenerator errorGenerator, String xmlData) {
        List < AssertionError > ublErrors;
        try {
            // ublErrors = ValidateUBL.validateUBL(xmlData);
            ublErrors = errorGenerator.generateErrors(xmlData, "UBL");
        } catch (SaxonApiException e) {
            return new PeppolUBLRuleResponse(false, "internal server error", null);
        }

        List < AssertionError > peppolErrors;
        try {
            peppolErrors = errorGenerator.generateErrors(xmlData, "PEPPOL");
        } catch (SaxonApiException e) {
            return new PeppolUBLRuleResponse(false, "internal server error", null);
        }

        boolean successful = ublErrors.isEmpty() && peppolErrors.isEmpty();
        String reason = "";
        if (!ublErrors.isEmpty() && !peppolErrors.isEmpty()) {
            reason = "Both UBL assertion errors and PEPPOL assertion errors were fired";
        } else if (!ublErrors.isEmpty()) {
            reason = "UBL assertion errors were fired";
        } else if (!peppolErrors.isEmpty()) {
            reason = "PEPPOL assertion errors were fired";
        }

        FiredAssertionErrors fae = new FiredAssertionErrors(peppolErrors, ublErrors);
        PeppolUBLRuleResponse resObject = new PeppolUBLRuleResponse(successful, reason, fae);
        return resObject;
    }
}