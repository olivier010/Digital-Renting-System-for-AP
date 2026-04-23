package com.backend.service;

import com.backend.exception.BadRequestException;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Slf4j
public class FileUploadService {

    @Value("${app.upload.dir}")
    private String uploadDir;

    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList("jpg", "jpeg", "png", "gif", "webp");
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    @Autowired
    private Cloudinary cloudinary;

    public String uploadImage(MultipartFile file) {
        if (file.isEmpty()) {
            throw new BadRequestException("File is empty");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BadRequestException("File size exceeds maximum allowed size of 10MB");
        }

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String extension = getFileExtension(originalFilename);

        if (!ALLOWED_EXTENSIONS.contains(extension.toLowerCase())) {
            throw new BadRequestException("Only image files are allowed (jpg, jpeg, png, gif, webp)");
        }

        try {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
            String url = uploadResult.get("secure_url").toString();

            log.info("File uploaded to Cloudinary: {}", url);
            return url;
        } catch (IOException e) {
            log.error("Failed to upload file to Cloudinary", e);
            throw new BadRequestException("Failed to upload file: " + e.getMessage());
        }
    }

    /**
     * Upload multiple images to Cloudinary and return their URLs.
     */
    public List<String> uploadImages(List<MultipartFile> files) {
        if (files == null || files.isEmpty()) {
            throw new BadRequestException("No files provided");
        }
        return files.stream().map(this::uploadImage).toList();
    }

    public void deleteImage(String imageUrl) {
        if (imageUrl == null || imageUrl.isEmpty()) {
            return;
        }
        try {
            String publicId = extractPublicIdFromUrl(imageUrl);
            if (publicId != null) {
                cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
                log.info("Image deleted from Cloudinary: {}", publicId);
            } else {
                log.warn("Could not extract public ID from URL: {}", imageUrl);
            }
        } catch (Exception e) {
            log.error("Failed to delete image from Cloudinary", e);
        }
    }

    private String extractPublicIdFromUrl(String url) {
        // Cloudinary URLs are like: https://res.cloudinary.com/<cloud_name>/image/upload/v<version>/<public_id>.<ext>
        Pattern pattern = Pattern.compile("/upload/(?:v\\d+/)?([\\w\\-/]+)\\.[a-zA-Z0-9]+$");
        Matcher matcher = pattern.matcher(url);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return null;
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf(".") + 1);
    }
}
