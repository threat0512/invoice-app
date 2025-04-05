package com.example.invoicevalidation.applicationlayer;


import org.xml.sax.InputSource;
import org.xml.sax.SAXException;



import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import java.io.IOException;
import java.io.StringReader;
import java.nio.file.Files;
import java.nio.file.Paths;

public class ValidateXML {

    public static void main(String[] args) {

        String xmlFilePath = "src/main/resources/sampleinvoices/formed.xml";
        String xmlData;
        try {
            xmlData = new String(Files.readAllBytes(Paths.get(xmlFilePath)));
            // System.out.println(xmlData);
            String res = ValidateXML.validateXML(xmlData);
            System.out.println(res);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    /**
     * Return true if valid XML, false otherwise
     */
    public static String validateXML(String xmlData) {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        factory.setNamespaceAware(true);
        try {
            DocumentBuilder builder = factory.newDocumentBuilder();
            builder.parse(new InputSource(new StringReader(xmlData)));
        } catch (ParserConfigurationException e) {
            e.printStackTrace();
            return "internal server error";
        } catch (SAXException e) {
            return e.getMessage();
        } catch (IOException e) {
            e.printStackTrace();
            return "internal server error";
        }
        return "true";

    }
}