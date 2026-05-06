package com.facility.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class DashboardStatsDto {
    private long totalFacilities;
    private long availableFacilities;
    private long maintenanceFacilities;
    private long pendingBookings;
    private long approvedBookings;
    private long totalBookings;
    private long openIssues;
    private long totalIssues;
    private long totalUsers;
}
