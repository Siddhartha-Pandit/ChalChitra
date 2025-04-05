package com.movie.ticket.booking.system.service.repository;

import com.movie.ticket.booking.system.service.entity.BookingEntity;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface BookingRepository extends CrudRepository<BookingEntity, UUID> {
}
