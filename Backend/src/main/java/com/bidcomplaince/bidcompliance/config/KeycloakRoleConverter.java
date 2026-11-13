package com.bidcomplaince.bidcompliance.config;

import org.springframework.context.annotation.Bean;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import static java.util.stream.Collectors.toList;

public class KeycloakRoleConverter
        implements Converter<Jwt, AbstractAuthenticationToken> {

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {

        Map<String, Object> realmAccess =
                jwt.getClaim("realm_access");

        if (realmAccess == null) {
            return new JwtAuthenticationToken(
                    jwt,
                    Collections.emptyList()
            );
        }

        Object rolesObject =
                realmAccess.get("roles");

        if (!(rolesObject instanceof Collection<?> roles)) {
            return new JwtAuthenticationToken(
                    jwt,
                    Collections.emptyList()
            );
        }

        List<SimpleGrantedAuthority> authorities =
                roles.stream()
                        .filter(role -> role instanceof String)
                        .map(role ->
                                new SimpleGrantedAuthority(
                                        "ROLE_" + role
                                )
                        )
                        .collect(toList());

        return new JwtAuthenticationToken(
                jwt,
                authorities
        );
    }
}
