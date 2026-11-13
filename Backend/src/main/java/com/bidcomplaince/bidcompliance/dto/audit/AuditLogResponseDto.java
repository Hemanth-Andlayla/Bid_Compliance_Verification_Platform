package com.bidcomplaince.bidcompliance.dto.audit;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.Instant;
import java.util.Map;

@Getter
@AllArgsConstructor
public class AuditLogResponseDto {

    private Long id;

    private Long userId;

    private String action;

    private String entityType;

    private Long entityId;

    private Map<String, Object> details;

    private Instant createdAt;
}