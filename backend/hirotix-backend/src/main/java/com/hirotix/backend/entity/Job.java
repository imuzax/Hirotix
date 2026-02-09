package com.hirotix.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "jobs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String company;

    private String location;


    private String description;

    private String salary;

    private String jobType; // FULL_TIME, PART_TIME, CONTRACT

    private String experienceLevel; // ENTRY, MID, SENIOR

    private java.time.LocalDateTime postedDate;

    @ManyToOne
    @JoinColumn(name = "recruiter_id")
    private User recruiter;
}
