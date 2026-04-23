package com.backend.controller;

import com.backend.dto.response.ApiResponse;
import com.backend.service.FileUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
public class UploadController {

    private final FileUploadService fileUploadService;

    @PostMapping("/image")
    public ResponseEntity<ApiResponse<String>> uploadImage(@RequestParam("file") MultipartFile file) {
        String imageUrl = fileUploadService.uploadImage(file);
        return ResponseEntity.ok(ApiResponse.success("Image uploaded successfully", imageUrl));
    }

    @DeleteMapping("/image")
    public ResponseEntity<ApiResponse<Void>> deleteImage(@RequestParam String imageUrl) {
        fileUploadService.deleteImage(imageUrl);
        return ResponseEntity.ok(ApiResponse.success("Image deleted successfully", null));
    }

    @PostMapping("/images")
    public ResponseEntity<ApiResponse<List<String>>> uploadImages(@RequestParam("files") List<MultipartFile> files) {
        List<String> imageUrls = fileUploadService.uploadImages(files);
        return ResponseEntity.ok(ApiResponse.success("Images uploaded successfully", imageUrls));
    }
}
