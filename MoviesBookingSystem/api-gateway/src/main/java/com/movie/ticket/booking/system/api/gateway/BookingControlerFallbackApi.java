package com.movie.ticket.booking.system.api.gateway;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BookingControlerFallbackApi {

    @GetMapping("/booking-fallback")
    public String bookingsFallBackApi(){
        return "Booking Service is in maintenance mode. Please try after some time";
    }
}
