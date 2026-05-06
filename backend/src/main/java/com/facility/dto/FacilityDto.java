package com.facility.dto;

import com.facility.entity.Facility;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class FacilityDto {

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class Request {
        @NotBlank(message = "Name is required")
        @Size(max = 150)
        private String name;

        private String description;

        @NotBlank(message = "Location is required")
        @Size(max = 200)
        private String location;

        @NotNull(message = "Capacity is required")
        @Min(value = 1, message = "Capacity must be at least 1")
        private Integer capacity;

        private Facility.Status status;

        private String imageUrl;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class Response {
        private Long id;
        private String name;
        private String description;
        private String location;
        private Integer capacity;
        private Facility.Status status;
        private String imageUrl;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}
