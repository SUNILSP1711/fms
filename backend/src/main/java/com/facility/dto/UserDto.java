package com.facility.dto;

import com.facility.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private User.Role role;
    private LocalDateTime createdAt;
}
