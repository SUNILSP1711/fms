package com.facility.service;

import com.facility.dto.FacilityDto;
import com.facility.entity.Facility;
import com.facility.exception.ResourceNotFoundException;
import com.facility.repository.FacilityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FacilityService {

    private final FacilityRepository facilityRepository;

    // ── Reads ──────────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public Page<FacilityDto.Response> getAll(String search, String status,
                                              int page, int size,
                                              String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Facility.Status statusEnum = (status != null && !status.isBlank())
                ? Facility.Status.valueOf(status.toUpperCase()) : null;
        String searchTerm = (search != null && !search.isBlank()) ? search : null;

        return facilityRepository.searchFacilities(searchTerm, statusEnum, pageable).map(this::toDto);
    }

    @Transactional(readOnly = true)
    public FacilityDto.Response getById(Long id) {
        return toDto(findOrThrow(id));
    }

    // ── Writes ─────────────────────────────────────────────────────────────────

    @Transactional
    public FacilityDto.Response create(FacilityDto.Request request) {
        Facility facility = Facility.builder()
                .name(request.getName())
                .description(request.getDescription())
                .location(request.getLocation())
                .capacity(request.getCapacity())
                .status(request.getStatus() != null ? request.getStatus() : Facility.Status.AVAILABLE)
                .imageUrl(request.getImageUrl())
                .build();
        return toDto(facilityRepository.save(facility));
    }

    @Transactional
    public FacilityDto.Response update(Long id, FacilityDto.Request request) {
        Facility facility = findOrThrow(id);
        facility.setName(request.getName());
        facility.setDescription(request.getDescription());
        facility.setLocation(request.getLocation());
        facility.setCapacity(request.getCapacity());
        if (request.getStatus()   != null) facility.setStatus(request.getStatus());
        if (request.getImageUrl() != null) facility.setImageUrl(request.getImageUrl());
        return toDto(facilityRepository.save(facility));
    }

    @Transactional
    public void delete(Long id) {
        findOrThrow(id);
        facilityRepository.deleteById(id);
    }

    // ── Helpers ────────────────────────────────────────────────────────────────

    private Facility findOrThrow(Long id) {
        return facilityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Facility", id));
    }

    public FacilityDto.Response toDto(Facility f) {
        return FacilityDto.Response.builder()
                .id(f.getId())
                .name(f.getName())
                .description(f.getDescription())
                .location(f.getLocation())
                .capacity(f.getCapacity())
                .status(f.getStatus())
                .imageUrl(f.getImageUrl())
                .createdAt(f.getCreatedAt())
                .updatedAt(f.getUpdatedAt())
                .build();
    }
}
