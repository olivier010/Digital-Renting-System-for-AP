package com.backend.controller;

import com.backend.dto.response.NotificationResponse;
import com.backend.dto.response.PageResponse;
import com.backend.service.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class NotificationControllerTest {

    private MockMvc mockMvc;

    private NotificationService notificationService;

    @BeforeEach
    void setUp() {
        notificationService = mock(NotificationService.class);
        NotificationController controller = new NotificationController(notificationService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    void getNotificationsReturnsPageData() throws Exception {
        NotificationResponse n = NotificationResponse.builder().id(1L).title("New booking").isRead(false).build();
        PageResponse<NotificationResponse> page = PageResponse.<NotificationResponse>builder()
                .content(List.of(n))
                .page(0)
                .size(10)
                .totalElements(1)
                .totalPages(1)
                .first(true)
                .last(true)
                .build();

        given(notificationService.getCurrentUserNotifications(any(), any(), any(), any(), eq(0), eq(10))).willReturn(page);

        mockMvc.perform(get("/api/notifications")
                        .param("page", "0")
                        .param("size", "10")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data.content[0].id").value(1L));
    }

    @Test
    void markAsReadReturnsUpdatedNotification() throws Exception {
        NotificationResponse response = NotificationResponse.builder().id(3L).isRead(true).build();
        given(notificationService.markAsRead(3L)).willReturn(response);

        mockMvc.perform(patch("/api/notifications/3/read"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data.id").value(3L))
                .andExpect(jsonPath("$.data.isRead").value(true));
    }
}




