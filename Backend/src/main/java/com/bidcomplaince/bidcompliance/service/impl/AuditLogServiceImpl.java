package com.bidcomplaince.bidcompliance.service.impl;

import com.bidcomplaince.bidcompliance.dto.audit.AuditLogResponseDto;
import com.bidcomplaince.bidcompliance.entity.AuditLog;
import com.bidcomplaince.bidcompliance.entity.User;
import com.bidcomplaince.bidcompliance.repository.AuditLogRepository;
import com.bidcomplaince.bidcompliance.repository.UserRepository;
import com.bidcomplaince.bidcompliance.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuditLogServiceImpl
        implements AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    @Override
    public void log(
            Long userId,
            String action,
            String entityType,
            Long entityId,
            String message) {

        AuditLog log = new AuditLog();

        if (userId != null) {

            User user =
                    userRepository.findById(userId)
                            .orElse(null);

            log.setUser(user);
        }

        log.setAction(action);
        log.setEntityType(entityType);
        log.setEntityId(entityId);

        Map<String, Object> details =
                new HashMap<>();

        details.put("message", message);

        log.setDetails(details);
        log.setCreatedAt(Instant.now());

        auditLogRepository.save(log);
    }

    @Override
    public List<AuditLogResponseDto> getLogs(
            String entityType,
            Long entityId) {

        return auditLogRepository
                .findByEntityTypeAndEntityIdOrderByCreatedAtDesc(
                        entityType,
                        entityId
                )
                .stream()
                .map(log ->
                        new AuditLogResponseDto(
                                log.getId(),
                                log.getUser() == null
                                        ? null
                                        : log.getUser().getId(),
                                log.getAction(),
                                log.getEntityType(),
                                log.getEntityId(),
                                log.getDetails(),
                                log.getCreatedAt()
                        )
                )
                .toList();
    }
}