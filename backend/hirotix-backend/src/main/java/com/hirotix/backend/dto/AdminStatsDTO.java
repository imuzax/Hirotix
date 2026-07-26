package com.hirotix.backend.dto;

public class AdminStatsDTO {
    private long totalUsers;
    private long totalSeekers;
    private long totalRecruiters;
    private long totalJobs;
    private long totalApplications;

    public AdminStatsDTO() {}

    public AdminStatsDTO(long totalUsers, long totalSeekers, long totalRecruiters, long totalJobs, long totalApplications) {
        this.totalUsers = totalUsers;
        this.totalSeekers = totalSeekers;
        this.totalRecruiters = totalRecruiters;
        this.totalJobs = totalJobs;
        this.totalApplications = totalApplications;
    }

    // Getters and Setters
    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getTotalSeekers() { return totalSeekers; }
    public void setTotalSeekers(long totalSeekers) { this.totalSeekers = totalSeekers; }

    public long getTotalRecruiters() { return totalRecruiters; }
    public void setTotalRecruiters(long totalRecruiters) { this.totalRecruiters = totalRecruiters; }

    public long getTotalJobs() { return totalJobs; }
    public void setTotalJobs(long totalJobs) { this.totalJobs = totalJobs; }

    public long getTotalApplications() { return totalApplications; }
    public void setTotalApplications(long totalApplications) { this.totalApplications = totalApplications; }
}
