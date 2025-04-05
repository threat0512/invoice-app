package com.example.invoicevalidation.applicationlayer;

import org.apache.tomcat.util.http.fileupload.ByteArrayOutputStream;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.OutputStream;
// import java.nio.file.Path;


public class HTMLToPDFConverter {

    public static void main(String[] args) throws IOException {
        String htmlFilePath = "input.html";
        String htmlContent = new String(Files.readAllBytes(Path.of(htmlFilePath)));
        ByteArrayOutputStream os = new ByteArrayOutputStream();
        convertHTMLToPDF2(htmlContent, os);
    }

    /**
     * convert HTML to pdf, giving result in a byte[]
     * @param htmlContent
     * @return
     */
    public static byte[] convertHTMLToPDF(String htmlContent) {
        ByteArrayOutputStream os = new ByteArrayOutputStream();
        HTMLToPDFConverter.convertHTMLToPDF2(htmlContent, os);
        byte[] bytes = os.toByteArray();
        return bytes;
    }

    /**
     * convert HTML to pdf, but user specifies the output stream
     * used for testing
     * @param htmlContent
     * @param os
     */
    public static void convertHTMLToPDF2(String htmlContent, OutputStream os) {
        try {
            // ByteArrayOutputStream os = new ByteArrayOutputStream();
            ITextRenderer renderer = new ITextRenderer();
            renderer.setDocumentFromString(htmlContent);
            renderer.layout();
            renderer.createPDF(os);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}