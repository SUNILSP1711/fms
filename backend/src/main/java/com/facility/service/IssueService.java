package com.facility.service;

import com.facility.dto.IssueDto;
import com.facility.entity.Facility;
import com.facility.entity.Issue;
import com.facility.entity.User;
import com.facility.exception.ResourceNotFoundException;
import com.facility.repository.FacilityRepository;
import com.facility.repository.IssueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class IssueService {

    private final IssueRepository    issueRepository;
    private final FacilityRepository facilityRepository;
    private final FacilityService    facilityService;

    // ── Reads ──────────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public Page<IssueDto.Response> getAllIssues(String status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        if (status != null && !status.isBlank()) {
            return issueRepository
                    .findByStatus(Issue.Status.valueOf(status.toUpperCase()), pageable)
                    .map(this::toDto);
        }
        return issueRepository.findAll(pageable).map(this::toDto);
    }

    @Transactional(readOnly = true)
    public Page<IssueDto.Response> getMyIssues(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return issueRepository.findByReporterId(userId, pageable).map(this::toDto);
    }

    @Transactional(readOnly = true)
    public IssueDto.Response getById(Long id) {
        return toDto(findOrThrow(id));
    }

    // ── Writes ─────────────────────────────────────────────────────────────────

    @Transactional
    public IssueDto.Response create(IssueDto.Request request, User reporter) {
        Facility facility = facilityRepository.findById(request.getFacilityId())
                .orElseThrow(() -> new ResourceNotFoundException("Facility", request.getFacilityId()));

        Issue issue = Issue.builder()
                .reporter(reporter)
                .facility(facility)
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority() != null ? request.getPriority() : Issue.Priority.MEDIUM)
                .status(Issue.Status.OPEN)
                .build();

        return toDto(issueRepository.save(issue));
    }

    @Transactional
    public IssueDto.Response updateStatus(Long id, Issue.Status status, User currentUser) {
        Issue issue = findOrThrow(id);
        if (currentUser.getRole() == User.Role.STAFF
                && !issue.getReporter().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You can only update your own issues.");
        }
        issue.setStatus(status);
        return toDto(issueRepository.save(issue));
    }

    @Transactional
    public void delete(Long id, User currentUser) {
        Issue issue = findOrThrow(id);
        if (currentUser.getRole() == User.Role.STAFF
                && !issue.getReporter().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You can only delete your own issues.");
        }
        issueRepository.deleteById(id);
    }

    // ── Helpers ────────────────────────────────────────────────────────────────

    private Issue findOrThrow(Long id) {
        return issueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Issue", id));
    }

    private IssueDto.Response toDto(Issue i) {
        return IssueDto.Response.builder()
                .id(i.getId())
                .reporter(AuthService.toDto(i.getReporter()))
                .facility(facilityService.toDto(i.getFacility()))
                .title(i.getTitle())
                .description(i.getDescription())
                .priority(i.getPriority())
                .status(i.getStatus())
                .createdAt(i.getCreatedAt())
                .updatedAt(i.getUpdatedAt())
                .build();
    }
}
