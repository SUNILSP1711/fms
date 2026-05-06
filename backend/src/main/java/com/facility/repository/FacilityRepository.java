package com.facility.repository;

import com.facility.entity.Facility;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface FacilityRepository extends JpaRepository<Facility, Long> {

    @Query("""
        SELECT f FROM Facility f
        WHERE (CAST(:search AS string) IS NULL OR LOWER(f.name) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%'))
                                          OR LOWER(f.location) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')))
          AND (:status IS NULL OR f.status = :status)
        """)
    Page<Facility> searchFacilities(
            @Param("search") String search,
            @Param("status") Facility.Status status,
            Pageable pageable
    );
}
