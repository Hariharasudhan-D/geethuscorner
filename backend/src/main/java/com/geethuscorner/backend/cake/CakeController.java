package com.geethuscorner.backend.cake;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cakes")
@RequiredArgsConstructor
public class CakeController {
    private final CakeService cakeService;

    @GetMapping
    public List<Cake> getAvailableCakes() {
        return cakeService.getAvailableCakes();
    }

    @GetMapping("/all")
    public List<Cake> getAllCakes() {
        return cakeService.getAllCakes();
    }

    @GetMapping("/{id}")
    public Cake getCake(@PathVariable Long id) {   // takes 5 from the URL
        return cakeService.getCakeById(id);
    }

    @PostMapping
    public ResponseEntity<Cake> createCake(@RequestBody Cake cake) {
        Cake saved = cakeService.createCake(cake);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);  // 201 Created
    }

    @PutMapping("/{id}")
    public Cake updateCake(@PathVariable Long id, @RequestBody Cake cake) {
        return cakeService.updateCake(id, cake);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCake(@PathVariable Long id) {
        cakeService.deleteCake(id);
        return ResponseEntity.noContent().build();   // 204 No Content
    }

}
