package pepedevelopers.cursitu.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import pepedevelopers.cursitu.model.user_data.StudentDTO;
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
      List<UserEntity> checkList = userRepo.findAll();

      checkList.forEach(u -> {
        if (user.getDni().equals(u.getDni())) {
          throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ya hay un alumno registrado con ese DNI.");
        }
      });

      if ("ALUMNO".equals(user.getRole()) && user.getComission().length > 1) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Un alumno no puede tener múltiples comisiones.");
      }

      user.setPassword(user.getDni());

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

        if ("ALUMNO".equals(userToUpdate.getRole()) && userToUpdate.getComission().length > 1) {
          throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Un alumno solo puede tener una comisión.");
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
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable String id) {
      userRepo.deleteById(id);
      Map<String, String> response = new HashMap<>();
      response.put("message", "Usuario eliminado con éxito.");
      return ResponseEntity.ok(response);
    }

    @GetMapping("/students")
    public List<StudentDTO> getOnlyStudents() {
      return userRepo.findByRole("ALUMNO")
        .stream()
        .map(user -> new StudentDTO(
          user.getName(),
          user.getEmail(),
          user.getPassword(),
          user.getDni(),
          user.getRole(),
          user.getComission(),
          user.getClassroom_number(),
          user.getSubjects_id()
        ))
        .toList();
    }
}
