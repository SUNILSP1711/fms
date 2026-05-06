package com.facility.controller;

import com.facility.dto.IssueDto;
import com.facility.entity.User;
import com.facility.service.IssueService;
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
@RequestMapping("/issues")
@RequiredArgsConstructor
@Tag(name = "Issues", description = "Issue reporting and management APIs")
@SecurityRequirement(name = "bearerAuth")
public class IssueController {

    private final IssueService issueService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all issues (Admin only)")
    public ResponseEntity<Page<IssueDto.Response>> getAll(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(issueService.getAllIssues(status, page, size));
    }

    @GetMapping("/my")
    @Operation(summary = "Get current user's reported issues")
    public ResponseEntity<Page<IssueDto.Response>> getMyIssues(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(issueService.getMyIssues(user.getId(), page, size));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get issue by ID")
    public ResponseEntity<IssueDto.Response> getById(@PathVariable Long id) {
        return ResponseEntity.ok(issueService.getById(id));
    }

    @PostMapping
    @Operation(summary = "Report a new issue")
    public ResponseEntity<IssueDto.Response> create(
            @Valid @RequestBody IssueDto.Request request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(issueService.create(request, user));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update issue status")
    public ResponseEntity<IssueDto.Response> updateStatus(
            @PathVariable Long id,
            @RequestBody IssueDto.StatusUpdate body,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(issueService.updateStatus(id, body.getStatus(), user));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an issue")
    public ResponseEntity<Void> delete(@PathVariable Long id,
                                       @AuthenticationPrincipal User user) {
        issueService.delete(id, user);
        return ResponseEntity.noContent().build();
    }
}
