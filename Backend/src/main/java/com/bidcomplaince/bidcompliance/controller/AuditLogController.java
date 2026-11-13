package com.bidcomplaince.bidcompliance.controller;

import com.bidcomplaince.bidcompliance.dto.audit.AuditLogResponseDto;
import com.bidcomplaince.bidcompliance.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping("/{entityType}/{entityId}")
    public ResponseEntity<List<AuditLogResponseDto>>
    getLogs(
            @PathVariable String entityType,
            @PathVariable Long entityId) {

        return ResponseEntity.ok(
                auditLogService.getLogs(
                        entityType,
                        entityId
                )
        );
    }
}