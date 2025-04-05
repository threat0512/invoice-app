package com.example.invoicevalidation.auth;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Date;

public interface LogRepository extends MongoRepository <EndpointLog, String> {
    List <EndpointLog> findByRequestTimestampBetween(Date startDate, Date endDate);
    List <EndpointLog> findByRequestTimestampBefore(Date endDate);
    List <EndpointLog> findByRequestTimestampAfter(Date startDate);
}
