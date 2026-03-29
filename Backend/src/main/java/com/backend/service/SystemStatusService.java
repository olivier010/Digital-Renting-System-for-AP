package com.backend.service;

import com.backend.dto.response.SystemStatusResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.lang.management.ManagementFactory;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SystemStatusService {
    // Inject your repositories/services as needed
    private static final long REFERENCE_PERIOD_SECONDS = 24 * 60 * 60; // 24 hours
    private static final long START_TIME_MILLIS = ManagementFactory.getRuntimeMXBean().getStartTime();

    public SystemStatusResponse getSystemStatus() {
        String dbStatus = checkDatabase() ? "UP" : "DOWN";
        Map<String, String> apiStatuses = checkExternalApis();
        String fileStorageStatus = checkFileStorage() ? "UP" : "DOWN";
        String mqStatus = checkMessageQueue() ? "UP" : "DOWN";
        String uptime = getUptime();
        int errorCount = 0;
        double uptimePercentage = calculateUptimePercentage();

        return new SystemStatusResponse(
                dbStatus,
                apiStatuses,
                fileStorageStatus,
                mqStatus,
                uptime,
                errorCount,
                uptimePercentage
        );
    }

    private boolean checkDatabase() {
        try {
            // Example: userRepository.count();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private Map<String, String> checkExternalApis() {
        Map<String, String> statuses = new HashMap<>();
        // Example: statuses.put("paymentGateway", checkPaymentGateway() ? "UP" : "DOWN");
        // Example: statuses.put("emailService", checkEmailService() ? "UP" : "DOWN");
        // Add real checks here, for now stub as UP
        statuses.put("paymentGateway", "UP");
        statuses.put("emailService", "UP");
        return statuses;
    }

    private boolean checkFileStorage() {
        // Example: try accessing a file or S3 bucket
        return true;
    }

    private boolean checkMessageQueue() {
        // Example: try connecting to RabbitMQ/Redis
        return true;
    }

    private String getUptime() {
        long uptimeMillis = ManagementFactory.getRuntimeMXBean().getUptime();
        Duration d = Duration.ofMillis(uptimeMillis);
        return String.format("%d:%02d:%02d", d.toHours(), d.toMinutesPart(), d.toSecondsPart());
    }

    private double calculateUptimePercentage() {
        long nowMillis = System.currentTimeMillis();
        long uptimeMillis = ManagementFactory.getRuntimeMXBean().getUptime();
        long referencePeriodMillis = REFERENCE_PERIOD_SECONDS * 1000;
        long periodStart = nowMillis - referencePeriodMillis;
        long actualUptimeMillis;
        if (START_TIME_MILLIS > periodStart) {
            // System started within the reference period
            actualUptimeMillis = nowMillis - START_TIME_MILLIS;
        } else {
            // System has been up for the whole reference period
            actualUptimeMillis = referencePeriodMillis;
        }
        return (actualUptimeMillis * 100.0) / referencePeriodMillis;
    }
}
