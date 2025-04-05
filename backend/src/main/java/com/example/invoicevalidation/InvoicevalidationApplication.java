package com.example.invoicevalidation;


import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.invoicevalidation.reponseobjs.PeppolUBLRuleResponse;
import com.example.invoicevalidation.reponseobjs.ValidationResponse;



import com.example.invoicevalidation.applicationlayer.GenerateHTML;
import com.example.invoicevalidation.applicationlayer.HTMLToPDFConverter;
import com.example.invoicevalidation.applicationlayer.ValidateAgainstXSD;
import com.example.invoicevalidation.applicationlayer.XSLTErrorGenerator;
import com.example.invoicevalidation.auth.EndpointLog;
import com.example.invoicevalidation.auth.JwtTokenProvider;
import com.example.invoicevalidation.auth.LogRepository;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

@SpringBootApplication
@RestController
public class InvoicevalidationApplication {

    @Autowired
    XSLTErrorGenerator errorGenerator;

    @Autowired
    ValidateAgainstXSD xsdValidator;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private LogRepository logRepository;

    public static void main(String[] args) {
        SpringApplication.run(InvoicevalidationApplication.class, args);
    }

    @GetMapping("/")
    public String method() {
        return "hello spring";
    }

    @PostMapping(value = "/api/validate/json", consumes = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity < ? > validateJson(@RequestBody String xmlData, 
        @RequestHeader("Authorization") String token) {
        logRepository.save(new EndpointLog("POST", "/api/validate/json", new Date()));

        if (!jwtTokenProvider.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        }

        ValidationResponse validationResponse = ResponseCreator.getValidationResponse(this.xsdValidator, xmlData);
        if (!validationResponse.isSuccessful()) {
            if (validationResponse.getReason().equals("internal server error")) {
                return ResponseEntity.status(500).body(validationResponse);
            } else {
                return ResponseEntity.status(201).body(validationResponse);
            }
        }

        PeppolUBLRuleResponse peppolublRuleResponse = ResponseCreator.getPeppolUblResponseObject(this.errorGenerator,
            xmlData);
        if (!peppolublRuleResponse.isSuccessful()) {
            if (peppolublRuleResponse.getReason().equals("internal server error")) {
                return ResponseEntity.status(500).body(peppolublRuleResponse);
            } else {
                return ResponseEntity.status(202).body(peppolublRuleResponse);
            }
        }
        return ResponseEntity.status(200).body(peppolublRuleResponse);
    }

    @PostMapping(value = "/api/validate/html", consumes = MediaType.APPLICATION_XML_VALUE, produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity < ? > validateHTML(@RequestBody String xmlData, @RequestHeader("Authorization") String token) {
        logRepository.save(new EndpointLog("POST", "/api/validate/html", new Date()));
        if (!jwtTokenProvider.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        }
        
        GenerateHTML htmlGenerator = new GenerateHTML();

        ValidationResponse validationResponse = ResponseCreator.getValidationResponse(this.xsdValidator, xmlData);
        if (!validationResponse.isSuccessful()) {
            // don't bother with more checks, return early
            return ResponseEntity.status(200).body(htmlGenerator.generateHTML(validationResponse, null, xmlData));
        }

        PeppolUBLRuleResponse peppolublRuleResponse = ResponseCreator.getPeppolUblResponseObject(this.errorGenerator,
            xmlData);
        return ResponseEntity.status(200)
            .body(htmlGenerator.generateHTML(validationResponse, peppolublRuleResponse, xmlData));
    }

    @PostMapping(value = "/api/validate/pdf", consumes = MediaType.APPLICATION_XML_VALUE, produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity < ? > validatePDF(@RequestBody String xmlData, @RequestHeader("Authorization") String token) {
        logRepository.save(new EndpointLog("POST", "/api/validate/pdf", new Date()));
        if (!jwtTokenProvider.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        }

        GenerateHTML htmlGenerator = new GenerateHTML();
        ValidationResponse validationResponse = ResponseCreator.getValidationResponse(this.xsdValidator, xmlData);
        if (!validationResponse.isSuccessful()) {
            // early finish if not sucessful
            String htmlContent = htmlGenerator.generateHTML(validationResponse, null, "");
            // System.out.println(htmlContent);
            byte[] bytes = HTMLToPDFConverter.convertHTMLToPDF(htmlContent);
            return ResponseEntity.status(200).body(bytes);
        }

        PeppolUBLRuleResponse peppolublRuleResponse = ResponseCreator.getPeppolUblResponseObject(this.errorGenerator,
            xmlData);
        String htmlContent = htmlGenerator.generateHTML(validationResponse, peppolublRuleResponse, "");
        // System.out.println(htmlContent);
        byte[] bytes = HTMLToPDFConverter.convertHTMLToPDF(htmlContent);
        return ResponseEntity.status(200).body(bytes);
    }

    private Date getdateObj(String dateStr) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm");
            LocalDateTime localDate = LocalDateTime.parse(dateStr, formatter);
            Date date = Date.from(localDate.atZone(ZoneId.of("Australia/Sydney")).toInstant());
            return date;
        } catch (Exception e) {
            return null;
        }

    }

    // get endpoint logs given start and end date
    // only admins can access this
    // date format should be in yyyy-MM-ddTHH:mm in AUSTRALIAN time
    @GetMapping("/logs/get/v2")
    public ResponseEntity <?>  getMethodName(@RequestHeader String adminKey, @RequestParam String startDateStr, @RequestParam String endDateStr) {
        if (!adminKey.equals("secretPassword123")) {
            return ResponseEntity.status(403).body("ERR UNAUTHORIZED");
        }
        List<EndpointLog> logs;
        Date startDate = getdateObj(startDateStr);
        Date endDate = getdateObj(endDateStr);

        System.out.println(startDate);
        System.out.println(endDate);

        if (startDate == null && endDate == null) {
            logs = logRepository.findAll();
        } else if (startDate == null && endDate != null) {
            logs = logRepository.findByRequestTimestampBefore(endDate);
        } else if (startDate != null && endDate == null) {
            logs = logRepository.findByRequestTimestampAfter(startDate);
        } else {
            logs = logRepository.findByRequestTimestampBetween(startDate, endDate);
        }

        return ResponseEntity.status(200).body(logs);


    }

}