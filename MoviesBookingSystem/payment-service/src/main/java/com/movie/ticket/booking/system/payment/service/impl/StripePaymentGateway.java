package com.movie.ticket.booking.system.payment.service.impl;

import com.movie.ticket.booking.system.payment.service.entity.PaymentStatus;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class StripePaymentGateway {

    @Value("${stripe.key}")
    private String secretKey;

    @PostConstruct
    public void init(){
        Stripe.apiKey = secretKey;
    }

    public PaymentStatus makePayment(Double paymentAmount){
        try {
            PaymentIntentCreateParams params = new PaymentIntentCreateParams.Builder()
                    .setAmount(paymentAmount.longValue())
                    .setCurrency("usd")
                    .setPaymentMethod("pm_card_in")
                    .build();
            PaymentIntent paymentIntent = PaymentIntent.create(params);
            return PaymentStatus.APPROVED;
        }catch(Exception e){
            log.error("Payment failed at gateway level with exception : "+ e.getMessage());
            return PaymentStatus.FAILED;
        }
    }

}
