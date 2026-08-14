package com.example.sunnyside.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    private static final long MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
    private static final String IMAGES_DIR = "images";
    private static final String BACKGROUND_IMAGE_FILENAME = "background.jpg";

    private volatile byte[] backgroundImageBytes;
    private volatile String backgroundImageContentType;
    private Path backgroundImagePath;

    @GetMapping("/background-image")
    public ResponseEntity<byte[]> getBackgroundImage() {
        if (backgroundImageBytes == null || backgroundImageBytes.length == 0 || backgroundImageContentType == null) {
            return ResponseEntity.noContent().build();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(backgroundImageContentType));
        headers.setCacheControl("no-store, no-cache, must-revalidate, max-age=0");

        return new ResponseEntity<>(backgroundImageBytes, headers, HttpStatus.OK);
    }

    @PostMapping(value = "/background-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadBackgroundImage(@RequestParam("image") MultipartFile imageFile) {
        if (imageFile == null || imageFile.isEmpty()) {
            return ResponseEntity.badRequest().body("Image file is required");
        }

        if (imageFile.getSize() > MAX_IMAGE_SIZE_BYTES) {
            return ResponseEntity.badRequest().body("Image must be 5MB or smaller");
        }

        String contentType = imageFile.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().body("Uploaded file must be an image");
        }

        try {
            // Save to memory
            this.backgroundImageBytes = imageFile.getBytes();
            this.backgroundImageContentType = contentType;

            // Save to disk
            Files.write(this.backgroundImagePath, this.backgroundImageBytes, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to store background image");
        }

        return ResponseEntity.ok().body("Background image uploaded successfully");
    }
    public void init() {
        try {
            // Create uploads directory if it doesn't exist
            Path uploadDir = Paths.get(IMAGES_DIR);
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            // Set the background image path
            this.backgroundImagePath = uploadDir.resolve(BACKGROUND_IMAGE_FILENAME);

            // Load existing background image if it exists
            if (Files.exists(this.backgroundImagePath)) {
                this.backgroundImageBytes = Files.readAllBytes(this.backgroundImagePath);
                this.backgroundImageContentType = getContentTypeFromFileName(BACKGROUND_IMAGE_FILENAME);
            }
        } catch (Exception e) {
            // Log error but don't fail startup
            System.err.println("Failed to initialize background image: " + e.getMessage());
        }
    }

    private String getContentTypeFromFileName(String fileName) {
        if (fileName == null) {
            return "application/octet-stream";
        }

        String lowerFileName = fileName.toLowerCase();
        if (lowerFileName.endsWith(".jpg") || lowerFileName.endsWith(".jpeg")) {
            return "image/jpeg";
        } else if (lowerFileName.endsWith(".png")) {
            return "image/png";
        } else if (lowerFileName.endsWith(".gif")) {
            return "image/gif";
        } else if (lowerFileName.endsWith(".webp")) {
            return "image/webp";
        } else {
            return "application/octet-stream";
        }
    }
}
