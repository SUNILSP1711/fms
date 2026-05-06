package com.facility.controller;

import com.facility.dto.FacilityDto;
import com.facility.service.FacilityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/facilities")
@RequiredArgsConstructor
@Tag(name = "Facilities", description = "Facility management APIs")
@SecurityRequirement(name = "bearerAuth")
public class FacilityController {

    private final FacilityService facilityService;

    @GetMapping
    @Operation(summary = "Get all facilities (paginated, searchable)")
    public ResponseEntity<Page<FacilityDto.Response>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0")    int page,
            @RequestParam(defaultValue = "10")   int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc")  String sortDir) {
        return ResponseEntity.ok(facilityService.getAll(search, status, page, size, sortBy, sortDir));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get facility by ID")
    public ResponseEntity<FacilityDto.Response> getById(@PathVariable Long id) {
        return ResponseEntity.ok(facilityService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new facility (Admin only)")
    public ResponseEntity<FacilityDto.Response> create(@Valid @RequestBody FacilityDto.Request request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(facilityService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update facility (Admin only)")
    public ResponseEntity<FacilityDto.Response> update(@PathVariable Long id,
                                                        @Valid @RequestBody FacilityDto.Request request) {
        return ResponseEntity.ok(facilityService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete facility (Admin only)")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        facilityService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
