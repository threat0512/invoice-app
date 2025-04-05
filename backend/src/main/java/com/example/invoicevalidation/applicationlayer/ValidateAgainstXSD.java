package com.example.invoicevalidation.applicationlayer;


import java.io.IOException;
import java.io.StringReader;


import javax.xml.XMLConstants;
import javax.xml.transform.stream.StreamSource;
import javax.xml.validation.Schema;
import javax.xml.validation.SchemaFactory;
import javax.xml.validation.Validator;


import org.springframework.core.env.Environment;
import org.springframework.core.env.Profiles;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import org.xml.sax.SAXException;

@Component
public class ValidateAgainstXSD {

    Environment environment;

    Validator validator;
    public ValidateAgainstXSD(Environment environment) throws SAXException, IOException {
        Resource mainResource = new ClassPathResource("schema/invoice.xsd");
        SchemaFactory schemaFactory = SchemaFactory.newInstance(XMLConstants.W3C_XML_SCHEMA_NS_URI);
        System.out.println("Loading XSD Schema");

        Schema schema;
        if (environment == null || environment.acceptsProfiles(Profiles.of("test"))) {
            System.out.println("test environment detected");
            schema = schemaFactory.newSchema(new StreamSource(mainResource.getFile()));
        } else {
            schema = schemaFactory.newSchema(new StreamSource(mainResource.getInputStream(), "classpath:/schema/"));
        }

        System.out.println("XSD Schema loaded successfully");
        Validator validator = schema.newValidator();
        this.validator = validator;
    }

    /**
     * 
     * @param xmlData contents of XML as text
     * @return
     */
    public String validateXMLAgainstXSD(String xmlData) {

        try {
            this.validator.validate(new StreamSource(new StringReader(xmlData)));
            System.out.println("XML is valid against XSD");
            return "true";
        } catch (SAXException e) {
            System.out.println("validation failed: " + e.getMessage());
            return e.getMessage();

        } catch (IOException e) {
            e.printStackTrace();
        }
        return "internal server error";
    }
}