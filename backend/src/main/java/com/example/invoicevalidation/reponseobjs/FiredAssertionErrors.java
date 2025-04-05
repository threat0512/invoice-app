package com.example.invoicevalidation.reponseobjs;
import java.util.*;
import lombok.Data;

@Data
public class FiredAssertionErrors {
    private List < AssertionError > AUNZ_PEPPOL_1_1_10;
    private List < AssertionError > AUNZ_UBL_1_1_10;

    public FiredAssertionErrors(List < AssertionError > aUNZ_PEPPOL_1_1_10, List < AssertionError > aUNZ_UBL_1_1_10) {
        AUNZ_PEPPOL_1_1_10 = aUNZ_PEPPOL_1_1_10;
        AUNZ_UBL_1_1_10 = aUNZ_UBL_1_1_10;
    }

}