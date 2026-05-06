package com.facility.controller;

import com.facility.dto.BookingDto;
import com.facility.entity.User;
import com.facility.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
@Tag(name = "Bookings", description = "Booking management APIs")
@SecurityRequirement(name = "bearerAuth")
public class BookingController {

    private final BookingService bookingService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all bookings (Admin only)")
    public ResponseEntity<Page<BookingDto.Response>> getAll(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(bookingService.getAllBookings(status, page, size));
    }

    @GetMapping("/my")
    @Operation(summary = "Get current user's bookings")
    public ResponseEntity<Page<BookingDto.Response>> getMyBookings(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(bookingService.getMyBookings(user.getId(), page, size));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get booking by ID")
    public ResponseEntity<BookingDto.Response> getById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getById(id));
    }

    @PostMapping
    @Operation(summary = "Create a new booking")
    public ResponseEntity<BookingDto.Response> create(
            @Valid @RequestBody BookingDto.Request request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.create(request, user));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update booking status (Admin: any, Staff: CANCELLED only)")
    public ResponseEntity<BookingDto.Response> updateStatus(
            @PathVariable Long id,
            @RequestBody BookingDto.StatusUpdate body,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookingService.updateStatus(id, body.getStatus(), user));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a booking")
    public ResponseEntity<Void> delete(@PathVariable Long id,
                                       @AuthenticationPrincipal User user) {
        bookingService.delete(id, user);
        return ResponseEntity.noContent().build();
    }
}
