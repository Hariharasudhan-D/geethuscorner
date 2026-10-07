package com.geethuscorner.backend.cake;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CakeService {
    private final CakeRepository cakeRepository;

    public List<Cake> getAvailableCakes(){

        return cakeRepository.findByAvailableTrue();
    }

    public List<Cake> getAllCakes() {
        return cakeRepository.findAll();
    }

    // Find one cake, or throw error if not found
    public Cake getCakeById(Long id) {
        return cakeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cake not found with id " + id));
    }

    public Cake createCake(Cake cake) {
        return cakeRepository.save(cake);
    }
    // Edit an existing cake (UPDATE)
    public Cake updateCake(Long id, Cake newData) {
        Cake cake = getCakeById(id);                       // 1. find old cake

        cake.setName(newData.getName());                   // 2. copy new values
        cake.setDescription(newData.getDescription());
        cake.setCategory(newData.getCategory());
        cake.setPrice(newData.getPrice());
        cake.setImageUrl(newData.getImageUrl());
        cake.setAvailable(newData.isAvailable());

        return cakeRepository.save(cake);                  // 3. save (has id → UPDATE)
    }

    // Delete a cake (error if it doesn't exist)
    public void deleteCake(Long id) {
        Cake cake = getCakeById(id);
        cakeRepository.delete(cake);
    }
}

