package com.bidcomplaince.bidcompliance.service.verification;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.HashMap;
import java.util.Map;

@Component
public class PanVerificationProvider implements VerificationProvider {

    private final RestClient restClient;


    public PanVerificationProvider() {
        this.restClient = RestClient.builder()
                .baseUrl("http://localhost:9001")
                .build();
    }

    @Override
    public boolean supports(String documentType) {
        return "PAN".equalsIgnoreCase(documentType);
    }

    @Override
    public VerificationResponse verify(
            Map<String, Object> extractedFields) {

        String pan = getString(extractedFields, "pan");
        String name = getString(extractedFields, "name");

        Map<String, Object> request = new HashMap<>();
        request.put("pan", pan);
        request.put("name", name);

        VerificationApiResponse response =
                restClient.post()
                        .uri("/api/verify/pan")
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(request)
                        .retrieve()
                        .body(VerificationApiResponse.class);

        if (response == null) {
            throw new IllegalStateException(
                    "Empty response from PAN verification API"
            );
        }

        return new VerificationResponse(
                response.status(),
                response.verifiedData(),
                response.reason()
        );
    }

    private String getString(
            Map<String, Object> fields,
            String key) {

        Object value = fields.get(key);

        if (value == null) {
            return null;
        }

        return value.toString();
    }

    private record VerificationApiResponse(
            boolean verified,
            String status,
            String reason,
            Map<String, Object> verifiedData
    ) {
    }
}