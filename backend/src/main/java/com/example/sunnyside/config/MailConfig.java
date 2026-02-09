package com.example.sunnyside.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessagePreparator;

import jakarta.mail.internet.MimeMessage;

/**
 * Provides a no-op console-logging JavaMailSender when no real mail sender is configured.
 * This allows testing email flow locally without an SMTP server.
 */
@Configuration
public class MailConfig {

    @Bean
    @ConditionalOnMissingBean(JavaMailSender.class)
    public JavaMailSender loggingMailSender() {
        return new JavaMailSender() {

            @Override
            public MimeMessage createMimeMessage() {
                throw new UnsupportedOperationException("MIME messages not supported by loggingMailSender");
            }

            @Override
            public MimeMessage createMimeMessage(java.io.InputStream contentStream) throws MailException {
                throw new UnsupportedOperationException("MIME messages not supported by loggingMailSender");
            }

            @Override
            public void send(MimeMessage mimeMessage) throws MailException {
                throw new UnsupportedOperationException("MIME messages not supported by loggingMailSender");
            }

            @Override
            public void send(MimeMessage... mimeMessages) throws MailException {
                throw new UnsupportedOperationException("MIME messages not supported by loggingMailSender");
            }

            @Override
            public void send(MimeMessagePreparator mimeMessagePreparator) throws MailException {
                throw new UnsupportedOperationException("MIME preparator not supported by loggingMailSender");
            }

            @Override
            public void send(MimeMessagePreparator... mimeMessagePreparators) throws MailException {
                throw new UnsupportedOperationException("MIME preparator not supported by loggingMailSender");
            }

            @Override
            public void send(SimpleMailMessage simpleMessage) throws MailException {
                System.out.println("\n===== LoggingMailSender: sending SimpleMailMessage =====");
                System.out.println("To: " + String.join(",", simpleMessage.getTo() == null ? new String[]{} : simpleMessage.getTo()));
                System.out.println("Subject: " + simpleMessage.getSubject());
                System.out.println("Text:\n" + simpleMessage.getText());
                System.out.println("===== End message =====\n");
            }

            @Override
            public void send(SimpleMailMessage... simpleMessages) throws MailException {
                for (SimpleMailMessage m : simpleMessages) send(m);
            }
        };
    }
}
