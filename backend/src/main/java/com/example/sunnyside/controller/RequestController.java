package com.example.sunnyside.controller;

import java.time.Instant;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.sunnyside.model.RequestPayload;

@RestController
@RequestMapping("/api/requests")
public class RequestController {

    private final List<RequestRecord> requests = new CopyOnWriteArrayList<>();
    private final AtomicLong counter = new AtomicLong(1);

    @PostMapping
    public ResponseEntity<RequestRecord> receiveRequest(@RequestBody RequestPayload payload) {
        RequestRecord record = new RequestRecord(counter.getAndIncrement(), Instant.now().toString(), payload);
        requests.add(record);
        return ResponseEntity.ok(record);
    }

    @GetMapping
    public List<RequestRecord> getRequests() {
        return requests;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRequest(@PathVariable long id) {
        boolean removed = requests.removeIf(r -> r.getId() == id);
        if (removed) {
            return ResponseEntity.ok().body("Request deleted");
        }
        return ResponseEntity.notFound().build();
    }

    public static class RequestRecord {
        private final long id;
        private final String receivedAt;
        private final RequestPayload payload;

        public RequestRecord(long id, String receivedAt, RequestPayload payload) {
            this.id = id;
            this.receivedAt = receivedAt;
            this.payload = payload;
        }

        public long getId() { return id; }
        public String getReceivedAt() { return receivedAt; }
        public RequestPayload getPayload() { return payload; }
    }
}
