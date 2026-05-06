package com.facility.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title       = "Facility Management System API",
        version     = "1.0.0",
        description = "REST API for managing facilities, bookings, and issue reports",
        contact     = @Contact(name = "FMS Team", email = "admin@fms.com")
    )
)
@SecurityScheme(
    name         = "bearerAuth",
    type         = SecuritySchemeType.HTTP,
    scheme       = "bearer",
    bearerFormat = "JWT",
    in           = SecuritySchemeIn.HEADER
)
public class OpenApiConfig {
    // Swagger UI: http://localhost:8080/api/swagger-ui.html
    // API Docs:   http://localhost:8080/api/v3/api-docs
}
