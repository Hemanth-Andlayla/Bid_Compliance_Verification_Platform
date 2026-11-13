package com.bidcomplaince.bidcompliance.service;

import com.bidcomplaince.bidcompliance.dto.audit.AuditLogResponseDto;

import java.util.List;

public interface AuditLogService {

    void log(
            Long userId,
            String action,
            String entityType,
            Long entityId,
            String message
    );

    List<AuditLogResponseDto> getLogs(
            String entityType,
            Long entityId
    );
}