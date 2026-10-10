package com.geethuscorner.backend.cake;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service                    // Spring creates and manages this class
@RequiredArgsConstructor    // Lombok: constructor for final fields
public class CakeService {

    private final CakeRepository cakeRepository;

    // Customers: only in-stock cakes
    public List<Cake> getAvailableCakes() {
        return cakeRepository.findByAvailableTrue();
    }

    // Admin: all cakes
    public List<Cake> getAllCakes() {
        return cakeRepository.findAll();
    }

    // Find one cake, or throw error if not found
    public Cake getCakeById(Long id) {
        return cakeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cake not found with id " + id));
    }

    // Add a new cake (now takes CakeRequest, not Cake) 🆕
    public Cake createCake(CakeRequest request) {
        Cake cake = new Cake();             // empty cake
        copyFields(request, cake);          // fill it from the request
        return cakeRepository.save(cake);   // INSERT
    }

    // Edit an existing cake (now takes CakeRequest) 🆕
    public Cake updateCake(Long id, CakeRequest request) {
        Cake cake = getCakeById(id);        // 1. find old cake
        copyFields(request, cake);          // 2. copy new values
        return cakeRepository.save(cake);   // 3. UPDATE
    }

    // Delete a cake (error if it doesn't exist)
    public void deleteCake(Long id) {
        Cake cake = getCakeById(id);
        cakeRepository.delete(cake);
    }

    // Helper: copy values from request into the cake 🆕
    private void copyFields(CakeRequest request, Cake cake) {
        cake.setName(request.name());
        cake.setDescription(request.description());
        cake.setCategory(request.category());
        cake.setPrice(request.price());
        cake.setImageUrl(request.imageUrl());
        cake.setAvailable(request.available() == null || request.available()); // missing → true
    }
}