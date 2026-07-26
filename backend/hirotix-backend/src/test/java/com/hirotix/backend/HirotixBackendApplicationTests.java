package com.hirotix.backend;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@Disabled("Disabled for cloud container build without running DB")
@SpringBootTest
class HirotixBackendApplicationTests {

    @Test
    void contextLoads() {
    }

}
