package com.example.applicationlayer;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.junit.jupiter.api.Test;
import org.springframework.test.context.ActiveProfiles;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.parsers.DocumentBuilder;
// import org.w3c.dom.Document;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;
import org.xmlunit.builder.DiffBuilder;
import org.xmlunit.builder.Input;
import org.xmlunit.diff.Diff;

import com.example.invoicevalidation.applicationlayer.HTMLToPDFConverter;
import com.example.invoicevalidation.applicationlayer.ValidateAgainstXSD;
import com.example.invoicevalidation.applicationlayer.ValidateXML;
import com.example.invoicevalidation.applicationlayer.XSLTErrorGenerator;
import com.example.invoicevalidation.reponseobjs.AssertionError;

import net.sf.saxon.s9api.XdmNode;
import java.io.ByteArrayInputStream;
import java.io.FileOutputStream;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Arrays;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.StringReader;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@ActiveProfiles("test")
class ApplicationLayerTests {

  static String baseUrl = "src/test/java/com/example/applicationlayer";

  @Test
  void testValidUBLInvoiceNoErrors() {
    assertDoesNotThrow(() -> {
      String xmlData = new String(Files.readAllBytes(Paths.get(baseUrl + "/resources/invoice.xml")));
      XSLTErrorGenerator errorGenerator = new XSLTErrorGenerator();
      List<AssertionError> out = errorGenerator.generateErrors(xmlData, "UBL");
      assertEquals(out, new ArrayList<>());
    });
  }

  @Test
  void testInvalidInvoiceUBLErrors() {
    assertDoesNotThrow(() -> {
      String xmlData = new String(Files.readAllBytes(Paths.get(baseUrl + "/resources/invalid.xml")));
      XSLTErrorGenerator errorGenerator = new XSLTErrorGenerator();
      List<AssertionError> out = errorGenerator.generateErrors(xmlData, "IBL");
      assertEquals(out.size(), 9);
      List<String> ids = new ArrayList<>();
      for (AssertionError e : out) {
        ids.add(e.getId());
      }
      List<String> expectedIds = new ArrayList<>();
      expectedIds.add("UBL-CR-656");
      expectedIds.add("UBL-CR-657");
      expectedIds.add("UBL-CR-660");
      expectedIds.add("UBL-CR-661");
      expectedIds.add("UBL-CR-663");
      expectedIds.add("UBL-CR-678");
      expectedIds.add("UBL-CR-679");
      expectedIds.add("UBL-DT-27");
      expectedIds.add("UBL-DT-28");
      Collections.sort(ids);
      Collections.sort(expectedIds);
      assertEquals(ids, expectedIds);
    });
  }

  @Test
  void testInvalidInvoicePEPPOLErrors() {
    assertDoesNotThrow(() -> {
      String xmlData = new String(Files.readAllBytes(Paths.get(baseUrl + "/resources/invalid.xml")));
      XSLTErrorGenerator errorGenerator = new XSLTErrorGenerator();
      List<AssertionError> out = errorGenerator.generateErrors(xmlData, "PEPPOL");
      assertEquals(out.size(), 3);
      List<String> ids = new ArrayList<>();
      for (AssertionError e : out) {
        ids.add(e.getId());
      }
      List<String> expectedIds = new ArrayList<>();
      expectedIds.add("PEPPOL-EN16931-R020");
      expectedIds.add("PEPPOL-EN16931-R010");
      expectedIds.add("AUNZ-R-004");
      Collections.sort(ids);
      Collections.sort(expectedIds);
      assertEquals(ids, expectedIds);
    });
  }

  @Test
  void testWellFormedXML() {
    String xmlFilePath = "src/main/resources/sampleinvoices/formed.xml";
    assertDoesNotThrow(() -> {
      String xmlData = new String(Files.readAllBytes(Paths.get(xmlFilePath)));
      assertEquals("true", ValidateXML.validateXML(xmlData));
    });

  }

  @Test
  void testInvalidMalformedXML() {
    String xmlFilePath = "src/main/resources/sampleinvoices/nonformed.xml";
    assertDoesNotThrow(() -> {
      String xmlData = new String(Files.readAllBytes(Paths.get(xmlFilePath)));
      // System.out.println(xmlData);
      assertNotEquals(ValidateXML.validateXML(xmlData), "true");
    });
  }

  @Test
  void testInvalidTags() {
    String xmlFilePath = baseUrl + "/resources/sample.xml";
    
    assertDoesNotThrow(() -> {
      ValidateAgainstXSD xsdValidator = new ValidateAgainstXSD(null);
      String xmlData = new String(Files.readAllBytes(Paths.get(xmlFilePath)));
      // System.out.println(xmlData);
      assertNotEquals(xsdValidator.validateXMLAgainstXSD(xmlData), "true");
    });
  }

  public static void main(String[] args) throws IOException {

    // String htmlFilePath = baseUrl + "/resources/sample.html"; // Provide the path to your HTML file
    // String outputPdfFilePath = baseUrl + "/resources/sample.pdf";
    // String htmlContent = new String(Files.readAllBytes(Path.of(htmlFilePath)));
    // HTMLToPDFConverter.convertHTMLToPDF2(htmlContent, new FileOutputStream(outputPdfFilePath));

  }

  @Test
    void testConvertHTMLToPDF() throws IOException {
      String htmlFilePath = baseUrl + "/resources/sample.html"; // Provide the path to your HTML file
      String outputPdfFilePath = baseUrl + "/resources/sample.pdf";
      // String expectedPdfFilePath = baseUrl + "/resources/sample.exp.pdf";

      String htmlContent = new String(Files.readAllBytes(Path.of(htmlFilePath)));
      HTMLToPDFConverter.convertHTMLToPDF2(htmlContent, new FileOutputStream(outputPdfFilePath));

      String text = extractTextFromPDF(outputPdfFilePath);
      System.out.println(text);
      assertEquals("This is a sample HTML content.\n", text);
    }

  public static String extractTextFromPDF(String pdfFilePath) throws IOException {
    try (PDDocument document = PDDocument.load(new File(pdfFilePath))) {
      PDFTextStripper stripper = new PDFTextStripper();
      return stripper.getText(document);
    }
  }

  public static String extractContentFromHTML(String htmlFilePath) throws IOException {
    Document doc = Jsoup.parse(new File(htmlFilePath), "UTF-8");

    // Remove title elements
    Elements titles = doc.select("title");
    titles.remove();

    // Extract text content from body
    Element body = doc.body();
    return body.text();
  }

}
