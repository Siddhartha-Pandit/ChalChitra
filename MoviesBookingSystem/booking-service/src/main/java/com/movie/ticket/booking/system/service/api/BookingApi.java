package com.movie.ticket.booking.system.service.api;

import com.movie.ticket.booking.system.commons.dto.BookingDTO;
import com.movie.ticket.booking.system.service.BookingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/bookings")
public class BookingApi {

    private static final Logger logger = LoggerFactory.getLogger(BookingApi.class);

    @Autowired
    private BookingService bookingService;

    @PostMapping("/create")
    public BookingDTO createBooking(@RequestBody BookingDTO bookingDTO) {
        logger.info("Received booking request: {}", bookingDTO);
        return bookingService.createBooking(bookingDTO);
    }
}
