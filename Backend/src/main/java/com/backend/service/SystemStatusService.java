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

    public SystemStatusResponse getSystemStatus() {
        String dbStatus = checkDatabase() ? "UP" : "DOWN";
        Map<String, String> apiStatuses = checkExternalApis();
        String fileStorageStatus = checkFileStorage() ? "UP" : "DOWN";
        String mqStatus = checkMessageQueue() ? "UP" : "DOWN";
        String uptime = getUptime();
        // Set errorCount to 0 or stub (not a number as per user request)
        int errorCount = 0;

        return new SystemStatusResponse(
                dbStatus,
                apiStatuses,
                fileStorageStatus,
                mqStatus,
                uptime,
                errorCount
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
}
