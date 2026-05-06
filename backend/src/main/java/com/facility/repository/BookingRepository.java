package com.facility.repository;

import com.facility.entity.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    Page<Booking> findByUserId(Long userId, Pageable pageable);

    Page<Booking> findByFacilityId(Long facilityId, Pageable pageable);

    Page<Booking> findByStatus(Booking.Status status, Pageable pageable);

    /**
     * Find bookings that overlap with the requested date range.
     * Uses a :statuses parameter (enum collection) — JPQL cannot compare enums
     * with string literals; passing them as typed params fixes the Hibernate type mismatch.
     */
    @Query("""
        SELECT b FROM Booking b
        WHERE b.facility.id = :facilityId
          AND b.status IN :statuses
          AND NOT (b.endDate < :startDate OR b.startDate > :endDate)
        """)
    List<Booking> findConflictingBookings(
            @Param("facilityId") Long facilityId,
            @Param("startDate")  LocalDate startDate,
            @Param("endDate")    LocalDate endDate,
            @Param("statuses")   Collection<Booking.Status> statuses
    );

    // Admin dashboard stats
    long countByStatus(Booking.Status status);
}
