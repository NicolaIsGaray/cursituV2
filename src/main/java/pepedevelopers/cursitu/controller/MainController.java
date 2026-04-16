package pepedevelopers.cursitu.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import static java.lang.IO.println;

@RestController
@CrossOrigin("/")
public class MainController {
    @GetMapping("/test")
    public void Saludo() {
        println("Hola mundo");
    }
}
