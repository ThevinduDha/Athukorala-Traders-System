package com.athukorala.inventory.repository;

// Corrected this line from .traders. to .inventory.
import com.athukorala.inventory.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {
}