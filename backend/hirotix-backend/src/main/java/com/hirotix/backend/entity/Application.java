package com.hirotix.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "seeker_id")
    private User seeker;

    @ManyToOne
    @JoinColumn(name = "job_id")
    private Job job;

    private String status; // APPLIED, SHORTLISTED, REJECTED

    private LocalDateTime appliedDate;

    private Double matchScore;
}
