package com.facility.controller;

import com.facility.dto.DashboardStatsDto;
import com.facility.entity.Booking;
import com.facility.entity.Facility;
import com.facility.entity.Issue;
import com.facility.repository.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin", description = "Admin dashboard APIs")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

    private final FacilityRepository facilityRepository;
    private final BookingRepository  bookingRepository;
    private final IssueRepository    issueRepository;
    private final UserRepository     userRepository;

    @GetMapping("/stats")
    @Operation(summary = "Get dashboard statistics")
    public ResponseEntity<DashboardStatsDto> getStats() {
        long totalFacilities       = facilityRepository.count();
        long availableFacilities   = facilityRepository.findAll().stream()
                .filter(f -> f.getStatus() == Facility.Status.AVAILABLE).count();
        long maintenanceFacilities = facilityRepository.findAll().stream()
                .filter(f -> f.getStatus() == Facility.Status.MAINTENANCE).count();
        long pendingBookings       = bookingRepository.countByStatus(Booking.Status.PENDING);
        long approvedBookings      = bookingRepository.countByStatus(Booking.Status.APPROVED);
        long totalBookings         = bookingRepository.count();
        long openIssues            = issueRepository.countByStatus(Issue.Status.OPEN);
        long totalIssues           = issueRepository.count();
        long totalUsers            = userRepository.count();

        return ResponseEntity.ok(DashboardStatsDto.builder()
                .totalFacilities(totalFacilities)
                .availableFacilities(availableFacilities)
                .maintenanceFacilities(maintenanceFacilities)
                .pendingBookings(pendingBookings)
                .approvedBookings(approvedBookings)
                .totalBookings(totalBookings)
                .openIssues(openIssues)
                .totalIssues(totalIssues)
                .totalUsers(totalUsers)
                .build());
    }
}
