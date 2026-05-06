package com.facility.dto;

import com.facility.entity.Issue;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class IssueDto {

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class Request {
        @NotNull(message = "Facility ID is required")
        private Long facilityId;

        @NotBlank(message = "Title is required")
        @Size(max = 200)
        private String title;

        @NotBlank(message = "Description is required")
        private String description;

        private Issue.Priority priority;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class Response {
        private Long id;
        private UserDto reporter;
        private FacilityDto.Response facility;
        private String title;
        private String description;
        private Issue.Priority priority;
        private Issue.Status status;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

    @Data
    public static class StatusUpdate {
        @NotNull
        private Issue.Status status;
    }
}
