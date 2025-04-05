package com.movie.ticket.booking.system.registry.service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class MovieServicesRegistryApplication {

    public static void main (String [] args) throws InterruptedException {
        SpringApplication.run (MovieServicesRegistryApplication.class, args);
    }

}
