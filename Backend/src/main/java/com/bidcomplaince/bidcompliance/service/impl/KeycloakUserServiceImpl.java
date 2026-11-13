package com.bidcomplaince.bidcompliance.service.impl;

import com.bidcomplaince.bidcompliance.dto.user.RegisterRequestDto;
import com.bidcomplaince.bidcompliance.service.KeycloakUserService;
import lombok.RequiredArgsConstructor;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.ws.rs.core.Response;

import java.util.List;

@Service
@RequiredArgsConstructor
public class KeycloakUserServiceImpl
        implements KeycloakUserService {

    private final Keycloak keycloak;

    @Value("${keycloak.app.realm}")
    private String applicationRealm;

    @Override
    public String createUser(RegisterRequestDto request) {

        UserRepresentation user =
                new UserRepresentation();

        user.setUsername(request.getEmail());
        user.setEmail(request.getEmail());
        user.setFirstName(request.getName());
        user.setEnabled(true);
        user.setEmailVerified(false);

        CredentialRepresentation credential =
                new CredentialRepresentation();

        credential.setType(
                CredentialRepresentation.PASSWORD
        );

        credential.setValue(
                request.getPassword()
        );

        credential.setTemporary(false);

        user.setCredentials(
                List.of(credential)
        );

        Response response =
                keycloak
                        .realm(applicationRealm)
                        .users()
                        .create(user);

        if (response.getStatus() != 201) {

            String message =
                    response.readEntity(String.class);

            response.close();

            throw new RuntimeException(
                    "Failed to create Keycloak user: "
                            + message
            );
        }

        String location =
                response
                        .getHeaderString("Location");

        response.close();

        String keycloakUserId =
                location.substring(
                        location.lastIndexOf('/') + 1
                );

        assignRole(
                keycloakUserId,
                request.getRole()
        );

        return keycloakUserId;
    }

    private void assignRole(
            String userId,
            String roleName) {

        RoleRepresentation role =
                keycloak
                        .realm(applicationRealm)
                        .roles()
                        .get(roleName)
                        .toRepresentation();

        keycloak
                .realm(applicationRealm)
                .users()
                .get(userId)
                .roles()
                .realmLevel()
                .add(List.of(role));
    }
}