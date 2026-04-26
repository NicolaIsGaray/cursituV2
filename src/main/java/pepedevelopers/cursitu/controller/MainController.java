package pepedevelopers.cursitu.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import static java.lang.IO.println;

@RestController("/")
@CrossOrigin(origins = "*")
public class MainController {
    @GetMapping("/test")
    public ResponseEntity<String> Saludo() {
        return ResponseEntity.ok("API FUNCIONANDO CON ANGULAR");
    }
}
