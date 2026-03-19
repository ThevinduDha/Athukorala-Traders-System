package com.athukorala.inventory.controller;

import com.athukorala.inventory.entity.Staff; // Ensure this is exactly correct
import com.athukorala.inventory.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/staff")
@CrossOrigin(origins = "http://localhost:3000")
public class StaffController {

    @Autowired
    private StaffRepository staffRepository;

    @GetMapping
    // Use the full path here to clear the "Incompatible types" error
    public List<com.athukorala.inventory.entity.Staff> getAllStaff() {
        return staffRepository.findAll();
    }

    @PostMapping
    public com.athukorala.inventory.entity.Staff createStaff(@RequestBody com.athukorala.inventory.entity.Staff staff) {
        return staffRepository.save(staff);
    }

    @PutMapping("/{id}")
    public com.athukorala.inventory.entity.Staff updateStaff(@PathVariable Long id, @RequestBody com.athukorala.inventory.entity.Staff staffDetails) {
        com.athukorala.inventory.entity.Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff member not found with id: " + id));

        staff.setName(staffDetails.getName());
        staff.setEmail(staffDetails.getEmail());
        staff.setRole(staffDetails.getRole());
        staff.setPhone(staffDetails.getPhone());

        return staffRepository.save(staff);
    }

    @DeleteMapping("/{id}")
    public String deleteStaff(@PathVariable Long id) {
        staffRepository.deleteById(id);
        return "Personnel Decommissioned Successfully";
    }
}