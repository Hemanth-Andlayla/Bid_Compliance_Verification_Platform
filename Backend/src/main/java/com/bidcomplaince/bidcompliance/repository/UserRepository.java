package com.bidcomplaince.bidcompliance.repository;

import com.bidcomplaince.bidcompliance.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User> findByKeycloakUserId(String keycloakUserId);

    Optional<User> findByEmail(String email);
}
