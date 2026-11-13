package com.bidcomplaince.bidcompliance.service.impl;

import com.bidcomplaince.bidcompliance.dto.user.RegisterRequestDto;
import com.bidcomplaince.bidcompliance.dto.user.UserResponseDto;
import com.bidcomplaince.bidcompliance.entity.User;
import com.bidcomplaince.bidcompliance.repository.UserRepository;
import com.bidcomplaince.bidcompliance.service.KeycloakUserService;
import com.bidcomplaince.bidcompliance.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl
        implements UserService {

    private final UserRepository userRepository;

    private final KeycloakUserService
            keycloakUserService;

    @Override
    public UserResponseDto getUser(Long id) {

        User user =
                userRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        return mapToResponse(user);
    }

    @Override
    public List<UserResponseDto> getAllUsers() {

        return userRepository
                .findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional
    public UserResponseDto register(
            RegisterRequestDto request) {

        if (!request.getPassword()
                .equals(request.getConfirmPassword())) {

            throw new RuntimeException(
                    "Passwords do not match"
            );
        }

        if (userRepository
                .findByEmail(request.getEmail())
                .isPresent()) {

            throw new RuntimeException(
                    "User already exists"
            );
        }

        String keycloakUserId =
                keycloakUserService.createUser(
                        request
                );

        User user = new User();

        user.setKeycloakUserId(
                keycloakUserId
        );

        user.setName(
                request.getName()
        );

        user.setEmail(
                request.getEmail()
        );

        user.setOrganization(
                request.getOrganization()
        );

        user.setCreatedAt(
                Instant.now()
        );

        user.setUpdatedAt(
                Instant.now()
        );

        User savedUser =
                userRepository.save(user);

        return mapToResponse(savedUser);
    }

    private UserResponseDto mapToResponse(
            User user) {

        return new UserResponseDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getOrganization(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}