package com.facility.service;

import com.facility.dto.BookingDto;
import com.facility.entity.Booking;
import com.facility.entity.Facility;
import com.facility.entity.User;
import com.facility.exception.BadRequestException;
import com.facility.exception.ResourceNotFoundException;
import com.facility.repository.BookingRepository;
import com.facility.repository.FacilityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository  bookingRepository;
    private final FacilityRepository facilityRepository;
    private final FacilityService    facilityService;

    // ── Reads ──────────────────────────────────────────────────────────────────
    // @Transactional(readOnly=true) keeps the session open so lazy associations
    // (b.getUser(), b.getFacility()) resolved inside toDto() don't throw
    // LazyInitializationException.

    @Transactional(readOnly = true)
    public Page<BookingDto.Response> getAllBookings(String status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        if (status != null && !status.isBlank()) {
            return bookingRepository
                    .findByStatus(Booking.Status.valueOf(status.toUpperCase()), pageable)
                    .map(this::toDto);
        }
        return bookingRepository.findAll(pageable).map(this::toDto);
    }

    @Transactional(readOnly = true)
    public Page<BookingDto.Response> getMyBookings(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return bookingRepository.findByUserId(userId, pageable).map(this::toDto);
    }

    @Transactional(readOnly = true)
    public BookingDto.Response getById(Long id) {
        return toDto(findOrThrow(id));
    }

    // ── Writes ─────────────────────────────────────────────────────────────────

    @Transactional
    public BookingDto.Response create(BookingDto.Request request, User currentUser) {
        Facility facility = facilityRepository.findById(request.getFacilityId())
                .orElseThrow(() -> new ResourceNotFoundException("Facility", request.getFacilityId()));

        if (facility.getStatus() == Facility.Status.MAINTENANCE) {
            throw new BadRequestException("Facility is under maintenance and cannot be booked.");
        }
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BadRequestException("End date cannot be before start date.");
        }
        if (request.getEndTime().isBefore(request.getStartTime())
                && request.getStartDate().equals(request.getEndDate())) {
            throw new BadRequestException("End time cannot be before start time.");
        }

        // Pass enum values as typed parameter — avoids JPQL string-literal type mismatch
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                facility.getId(),
                request.getStartDate(),
                request.getEndDate(),
                List.of(Booking.Status.PENDING, Booking.Status.APPROVED)
        );
        if (!conflicts.isEmpty()) {
            throw new BadRequestException("Facility is already booked for the selected dates.");
        }

        Booking booking = Booking.builder()
                .user(currentUser)
                .facility(facility)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .purpose(request.getPurpose())
                .status(Booking.Status.PENDING)
                .build();

        return toDto(bookingRepository.save(booking));
    }

    @Transactional
    public BookingDto.Response updateStatus(Long id, Booking.Status status, User currentUser) {
        Booking booking = findOrThrow(id);
        if (currentUser.getRole() == User.Role.STAFF) {
            if (!booking.getUser().getId().equals(currentUser.getId())) {
                throw new AccessDeniedException("You can only cancel your own bookings.");
            }
            if (status != Booking.Status.CANCELLED) {
                throw new AccessDeniedException("Staff can only cancel bookings.");
            }
        }
        booking.setStatus(status);
        return toDto(bookingRepository.save(booking));
    }

    @Transactional
    public void delete(Long id, User currentUser) {
        Booking booking = findOrThrow(id);
        if (currentUser.getRole() == User.Role.STAFF
                && !booking.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You can only delete your own bookings.");
        }
        bookingRepository.deleteById(id);
    }

    // ── Helpers ────────────────────────────────────────────────────────────────

    private Booking findOrThrow(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", id));
    }

    private BookingDto.Response toDto(Booking b) {
        return BookingDto.Response.builder()
                .id(b.getId())
                .user(AuthService.toDto(b.getUser()))
                .facility(facilityService.toDto(b.getFacility()))
                .startDate(b.getStartDate())
                .endDate(b.getEndDate())
                .startTime(b.getStartTime())
                .endTime(b.getEndTime())
                .purpose(b.getPurpose())
                .status(b.getStatus())
                .createdAt(b.getCreatedAt())
                .updatedAt(b.getUpdatedAt())
                .build();
    }
}
