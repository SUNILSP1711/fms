package com.facility.dto;

import com.facility.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

public class AuthDto {

    @Data
    public static class RegisterRequest {
        @NotBlank(message = "Name is required")
        @Size(min = 2, max = 100)
        private String name;

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;
    }

    @Data
    public static class LoginRequest {
        @NotBlank(message = "Email is required")
        @Email
        private String email;

        @NotBlank(message = "Password is required")
        private String password;
    }

    // @Builder on a nested static class requires explicit @AllArgsConstructor to avoid
    // the Lombok @Data vs @Builder constructor conflict.
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AuthResponse {
        private String token;
        private String type;
        private UserDto user;
    }
}
