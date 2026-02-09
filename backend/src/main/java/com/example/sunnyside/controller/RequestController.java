package com.example.sunnyside.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.sunnyside.model.RequestPayload;

@RestController
@RequestMapping("/api/requests")
public class RequestController {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String mailFrom;

    private static final String DEST = "tony_filippo@yahoo.com";

    @PostMapping
    public ResponseEntity<?> receiveRequest(@RequestBody RequestPayload payload) {
        // Build a plain-text summary of the request
        StringBuilder sb = new StringBuilder();
        sb.append("Service: ").append(payload.getService()).append("\n\n");
        sb.append("Owner: ").append(payload.getOwnerName()).append("\n");
        sb.append("Email: ").append(payload.getEmail()).append("\n");
        sb.append("Phone: ").append(payload.getPhone()).append("\n");
        sb.append("Address: ").append(payload.getAddress()).append("\n\n");

        if (payload.getWalkTime() != null) {
            sb.append("Walk time: ").append(payload.getWalkTime()).append("\n");
            sb.append("Duration: ").append(payload.getDuration()).append(" minutes\n\n");
        }
        if (payload.getFromDate() != null || payload.getToDate() != null) {
            sb.append("Sitting from: ").append(payload.getFromDate()).append(" to: ").append(payload.getToDate()).append("\n\n");
        }

        if (payload.getPets() != null && !payload.getPets().isEmpty()) {
            sb.append("Pets:\n");
            payload.getPets().forEach(p -> sb.append(" - ").append(p.getName()).append(" (").append(p.getSpecies()).append(") age: ").append(p.getAge()).append("\n"));
            sb.append("\n");
        }

        // Send email
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(DEST);
            if (mailFrom != null && !mailFrom.isEmpty()) {
                msg.setFrom(mailFrom);
            }
            msg.setSubject("New Sunnyside request: " + payload.getService());
            msg.setText(sb.toString());
            mailSender.send(msg);
            return ResponseEntity.ok().body("sent");
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("failed to send: " + ex.getMessage());
        }
    }
}
