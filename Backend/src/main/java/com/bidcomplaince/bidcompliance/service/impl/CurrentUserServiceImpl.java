package com.bidcomplaince.bidcompliance.service.impl;

import com.bidcomplaince.bidcompliance.entity.User;
import com.bidcomplaince.bidcompliance.repository.UserRepository;
import com.bidcomplaince.bidcompliance.service.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CurrentUserServiceImpl
        implements CurrentUserService {

    private final UserRepository userRepository;

    @Override
    public User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (!(authentication
                instanceof JwtAuthenticationToken jwtAuthenticationToken)) {

            throw new RuntimeException(
                    "Authenticated user is not a JWT user"
            );
        }

        String keycloakUserId =
                jwtAuthenticationToken
                        .getToken()
                        .getSubject();

        return userRepository
                .findByKeycloakUserId(keycloakUserId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Authenticated user is not registered "
                                        + "in the application"
                        )
                );
    }
}