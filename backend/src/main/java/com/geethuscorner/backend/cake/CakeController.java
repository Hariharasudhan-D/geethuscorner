package com.geethuscorner.backend.cake;

import jakarta.validation.Valid;                       // 🆕 new import
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController                  // answers requests with JSON
@RequestMapping("/api/cakes")    // all URLs start with /api/cakes
@RequiredArgsConstructor
public class CakeController {

    private final CakeService cakeService;

    // GET /api/cakes → in-stock cakes
    @GetMapping
    public List<Cake> getAvailableCakes() {
        return cakeService.getAvailableCakes();
    }

    // GET /api/cakes/all → all cakes
    @GetMapping("/all")
    public List<Cake> getAllCakes() {
        return cakeService.getAllCakes();
    }

    // GET /api/cakes/5 → one cake
    @GetMapping("/{id}")
    public Cake getCake(@PathVariable Long id) {
        return cakeService.getCakeById(id);
    }

    // POST /api/cakes → add a cake (rules checked) 🆕
    @PostMapping
    public ResponseEntity<Cake> createCake(@Valid @RequestBody CakeRequest request) {
        Cake saved = cakeService.createCake(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);   // 201
    }

    // PUT /api/cakes/5 → edit cake 5 (rules checked) 🆕
    @PutMapping("/{id}")
    public Cake updateCake(@PathVariable Long id, @Valid @RequestBody CakeRequest request) {
        return cakeService.updateCake(id, request);
    }

    // DELETE /api/cakes/5 → delete cake 5
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCake(@PathVariable Long id) {
        cakeService.deleteCake(id);
        return ResponseEntity.noContent().build();   // 204
    }
}