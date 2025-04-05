package com.example.invoicevalidation.applicationlayer;

import java.util.*;


import javax.xml.transform.stream.StreamSource;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;


import com.example.invoicevalidation.reponseobjs.AssertionError;

import net.sf.saxon.s9api.*;


import java.io.IOException;
import java.io.StringReader;


@Component
public class XSLTErrorGenerator {

    // private static Map<String, Xslt30Transformer> savedTransformers = new HashMap<>();

    private Xslt30Transformer peppolTransformer;
    private Xslt30Transformer ublTransformer;


    public XSLTErrorGenerator() throws SaxonApiException, IOException {
        Resource peppolR = new ClassPathResource("xslt/AUNZ-PEPPOL-validation.xslt");
        Resource ublR = new ClassPathResource("xslt/AUNZ-UBL-validation.xslt");

        // create transformer for PEPPOL rules
        Processor processor = new Processor(false);
        XsltCompiler compiler = processor.newXsltCompiler();
        XsltExecutable executable = compiler.compile(new StreamSource(peppolR.getInputStream()));
        this.peppolTransformer = executable.load30();

        // create transformer for UBL rules
        Processor processor2 = new Processor(false);
        XsltCompiler compiler2 = processor2.newXsltCompiler();
        XsltExecutable executable2 = compiler2.compile(new StreamSource(ublR.getInputStream()));
        this.ublTransformer = executable2.load30();
    }

    /**
     *
     * @param xmlData xml data as a string
     * @param xsltLocation path to xslt file
     * @return XdmNode: root of resulting xml from schematron
     * @throws SaxonApiException
     */
    public XdmNode applyXSLT(String xmlData, String ruleSet) throws SaxonApiException {
        Xslt30Transformer transformer;
        if (ruleSet.equals("PEPPOL")) {
            transformer = this.peppolTransformer;
        } else {
            transformer = this.ublTransformer;
        }

        XdmDestination resultDestination = new XdmDestination();
        transformer.transform(new StreamSource(new StringReader(xmlData)), resultDestination);

        XdmNode outXML = resultDestination.getXdmNode();
        return outXML;
    }

    /**
     * 
     * @param xmlData the xml file to validate
     * @return list of assertion errors
     * @throws SaxonApiException
     */
    public List < AssertionError > generateErrors(String xmlData, String ruleSet) throws SaxonApiException {
        List < AssertionError > assertionErrors = new ArrayList < > ();
        XdmNode errorReport;
        errorReport = this.applyXSLT(xmlData, ruleSet);
        XdmSequenceIterator < XdmNode > iterator = errorReport.axisIterator(Axis.CHILD);
        XdmNode schematron = iterator.next();

        for (XdmNode srvlParent: schematron.children()) {
            if (srvlParent.getNodeName() != null && srvlParent.getNodeName().toString().equals("svrl:failed-assert")) {
                String id = srvlParent.getAttributeValue(new net.sf.saxon.s9api.QName("id")).toString();
                String test = srvlParent.getAttributeValue(new net.sf.saxon.s9api.QName("test")).toString();
                String flag = srvlParent.getAttributeValue(new net.sf.saxon.s9api.QName("flag")).toString();
                String location = srvlParent.getAttributeValue(new net.sf.saxon.s9api.QName("location")).toString();
                String explanation = "";

                for (XdmNode text: srvlParent.children()) {
                    explanation = text.getStringValue();
                }

                assertionErrors.add(new AssertionError(id, test, explanation, flag));
            }
        }
        return assertionErrors;
    }
}