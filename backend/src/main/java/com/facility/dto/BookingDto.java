package com.facility.dto;

import com.facility.entity.Booking;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class BookingDto {

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class Request {
        @NotNull(message = "Facility ID is required")
        private Long facilityId;

        @NotNull(message = "Start date is required")
        private LocalDate startDate;

        @NotNull(message = "End date is required")
        private LocalDate endDate;

        @NotNull(message = "Start time is required")
        private LocalTime startTime;

        @NotNull(message = "End time is required")
        private LocalTime endTime;

        @Size(max = 1000)
        private String purpose;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class Response {
        private Long id;
        private UserDto user;
        private FacilityDto.Response facility;
        private LocalDate startDate;
        private LocalDate endDate;
        private LocalTime startTime;
        private LocalTime endTime;
        private String purpose;
        private Booking.Status status;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

    @Data
    public static class StatusUpdate {
        @NotNull
        private Booking.Status status;
    }
}
