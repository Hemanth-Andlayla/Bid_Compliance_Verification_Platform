package com.bidcomplaince.bidcompliance;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class BidComplianceApplication {

     static void main(String[] args) {
        SpringApplication.run(BidComplianceApplication.class, args);
    }

}
