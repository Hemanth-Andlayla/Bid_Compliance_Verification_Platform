package com.bidcomplaince.bidcompliance.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequestDto {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Organization is required")
    private String organization;

    @NotBlank(message = "Role is required")
    private String role;

    @NotBlank(message = "Password is required")
    @Size(
            min = 8,
            max = 64,
            message = "Password must be between 8 and 64 characters"
    )
    private String password;

    @NotBlank(message = "Confirm password is required")
    private String confirmPassword;
}