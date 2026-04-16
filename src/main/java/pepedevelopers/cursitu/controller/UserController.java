package pepedevelopers.cursitu.controller;

import org.springframework.web.bind.annotation.*;
import pepedevelopers.cursitu.model.user.UserEntity;
import pepedevelopers.cursitu.model.user.UserRole;
import pepedevelopers.cursitu.repository.IUser;

import java.util.List;

import static java.lang.IO.println;

@RestController
@CrossOrigin("/user")
public class UserController {
    private final IUser userRepo;

    public UserController(IUser userRepo) {
        this.userRepo = userRepo;
    }

    @PostMapping("/create-user")
    public void addUser(UserEntity user) {
        if (user == null) return;

        UserEntity newUser = new UserEntity();

        newUser.setName(user.getName());
        newUser.setEmail(user.getEmail());
        newUser.setPassword(user.getPassword());
        newUser.setDni(user.getDni());
        newUser.setRole(user.getRole());
        newUser.setComission(user.getComission());

        if (newUser.getRole() == UserRole.DOCENTE) {
            newUser.setSubjects(user.getSubjects());
        } else {
            newUser.setSubjects(null);
        }

        userRepo.save(newUser);

        println("Usuario creado con éxito");
    }

    @GetMapping("/search-user/{id}")
    public UserEntity SearchUser(@RequestParam String id) {
        UserEntity requestedUser = userRepo.findById(id).orElse(null);

        if (requestedUser == null) {
            println("Usuario encontrado.");
        }
        else {
            println("No se ha encontrado al usuario.");
        }

        return requestedUser;
    }

    @GetMapping("/all-users")
    public List<UserEntity> AllUsers() {
        return userRepo.findAll();
    }

    @PutMapping("/update-user/{id}")
    public void UpdateUser(@RequestParam String id, @RequestBody UserEntity userToUpdate) {
        UserEntity updatedUser = SearchUser(id);

        if (updatedUser == null) {
            println("Usuario no encontrado.");
        }
        else {
            updatedUser.setName(userToUpdate.getName());
            updatedUser.setEmail(userToUpdate.getEmail());
            updatedUser.setPassword(userToUpdate.getPassword());
            updatedUser.setDni(userToUpdate.getDni());
            updatedUser.setRole(userToUpdate.getRole());
            updatedUser.setComission(userToUpdate.getComission());
            updatedUser.setSubjects(userToUpdate.getSubjects());

            userRepo.save(updatedUser);

            println("Usuario actualizado con éxito.");
        }
    }

    @DeleteMapping("/delete-user/{id}")
    public void DeleteUser(String id) {
        UserEntity deletedUser = SearchUser(id);

        if (deletedUser == null) {
            println("Usuario no encontrado.");
            return;
        }

        userRepo.delete(deletedUser);

        println("Usuario eliminado con éxito.");
    }
}
