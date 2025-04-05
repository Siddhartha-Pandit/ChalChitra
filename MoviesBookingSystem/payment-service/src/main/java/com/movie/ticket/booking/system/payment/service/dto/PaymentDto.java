package com.movie.ticket.booking.system.payment.service.dto;

import com.movie.ticket.booking.system.payment.service.entity.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaymentDto {
    private UUID bookingId;
    private PaymentStatus paymentStatus;
    private Double paymentAmount;
}
