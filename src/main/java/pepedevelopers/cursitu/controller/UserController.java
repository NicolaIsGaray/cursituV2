package pepedevelopers.cursitu.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pepedevelopers.cursitu.repository.IUser;
import pepedevelopers.cursitu.model.UserEntity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static java.lang.IO.println;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    private final IUser userRepo;

    public UserController(IUser userRepo) {
        this.userRepo = userRepo;
    }

    @PostMapping
    public ResponseEntity<UserEntity> addUser(@RequestBody UserEntity user) {
       return new ResponseEntity<>(userRepo.save(user), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public UserEntity searchUser(@PathVariable String id) {
        return userRepo.findById(id).orElse(null);
    }

    @GetMapping("/dni/{dni}")
    public List<UserEntity> searchByDni(@PathVariable String dni) { return userRepo.findByDniContaining(dni).orElse(null); }

    @GetMapping
    public ResponseEntity<List<UserEntity>> allUsers() {
        return ResponseEntity.ok(userRepo.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable String id, @RequestBody UserEntity userToUpdate) {
        UserEntity updatedUser = userRepo.findById(id).orElse(null);

        if (updatedUser == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado.");
        }

        updatedUser.setName(userToUpdate.getName() == null ? updatedUser.getName() : userToUpdate.getName());
        updatedUser.setEmail(userToUpdate.getEmail() == null ? updatedUser.getEmail() : userToUpdate.getEmail());
        updatedUser.setPassword(userToUpdate.getPassword() == null ? updatedUser.getPassword() : userToUpdate.getPassword());
        updatedUser.setDni(userToUpdate.getDni() == null ? updatedUser.getDni() : userToUpdate.getDni());
        updatedUser.setRole(userToUpdate.getRole() == null ? updatedUser.getRole() : userToUpdate.getRole());
        updatedUser.setComission(userToUpdate.getComission() == null ? updatedUser.getComission() : userToUpdate.getComission());
        updatedUser.setClassroom_number(userToUpdate.getClassroom_number() == null ? updatedUser.getClassroom_number() : userToUpdate.getClassroom_number());
        updatedUser.setSubjects_id(userToUpdate.getSubjects_id() == null ? updatedUser.getSubjects_id() : userToUpdate.getSubjects_id());

        userRepo.save(updatedUser);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Usuario modificado.");

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable String id) {
      UserEntity deletedUser = userRepo.findById(id).orElse(null);

      if (deletedUser == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado.");
      }

      userRepo.delete(deletedUser);

      return ResponseEntity.ok("Usuario eliminado");
    }
}
