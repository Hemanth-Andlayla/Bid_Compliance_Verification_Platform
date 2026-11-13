
        package com.bidcomplaince.bidcompliance.controller;

import com.bidcomplaince.bidcompliance.dto.user.UserResponseDto;
import com.bidcomplaince.bidcompliance.entity.User;
import com.bidcomplaince.bidcompliance.service.CurrentUserService;
import com.bidcomplaince.bidcompliance.service.UserService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    private final UserService userService;
    private final CurrentUserService currentUserService;

    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> getCurrentUser() {

        User currentUser =
                currentUserService.getCurrentUser();

        return ResponseEntity.ok(
                userService.getUser(
                        currentUser.getId()
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDto> getUserById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                userService.getUser(id)
        );
    }

    @GetMapping
    public ResponseEntity<List<UserResponseDto>> getAllUsers() {

        return ResponseEntity.ok(
                userService.getAllUsers()
        );
    }
}