package com.facility.service;

import com.facility.dto.AuthDto;
import com.facility.dto.UserDto;
import com.facility.entity.User;
import com.facility.exception.BadRequestException;
import com.facility.repository.UserRepository;
import com.facility.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtUtil jwtUtil;
        private final AuthenticationManager authenticationManager;

        @Transactional
        public AuthDto.AuthResponse register(AuthDto.RegisterRequest request) {
                if (userRepository.existsByEmail(request.getEmail())) {
                        throw new BadRequestException("Email is already registered: " + request.getEmail());
                }

                User user = User.builder()
                                .name(request.getName())
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .role(User.Role.STAFF) // new registrations are always STAFF
                                .build();

                userRepository.save(user);

                String token = jwtUtil.generateToken(user);
                return AuthDto.AuthResponse.builder()
                                .token(token)
                                .type("Bearer")
                                .user(toDto(user))
                                .build();
        }

        public AuthDto.AuthResponse login(AuthDto.LoginRequest request) {
                User user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new BadRequestException("User not found"));

                if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                        throw new BadRequestException("Invalid password");
                }

                String token = jwtUtil.generateToken(user);
                return AuthDto.AuthResponse.builder()
                                .token(token)
                                .type("Bearer")
                                .user(toDto(user))
                                .build();
        }

        public static UserDto toDto(User user) {
                return UserDto.builder()
                                .id(user.getId())
                                .name(user.getName())
                                .email(user.getEmail())
                                .role(user.getRole())
                                .createdAt(user.getCreatedAt())
                                .build();
        }
}
