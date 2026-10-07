package com.geethuscorner.backend.cake;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CakeRepository extends JpaRepository<Cake, Long> {

    List<Cake> findByAvailableTrue();
    List<Cake> findByCategory(String category);
}
