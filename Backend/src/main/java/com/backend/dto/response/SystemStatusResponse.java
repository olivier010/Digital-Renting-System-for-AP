package com.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.Map;

@Data
@AllArgsConstructor
public class SystemStatusResponse {
    private String database;
    private Map<String, String> externalApis;
    private String fileStorage;
    private String messageQueue;
    private String uptime;
    private int recentErrorCount;
}

