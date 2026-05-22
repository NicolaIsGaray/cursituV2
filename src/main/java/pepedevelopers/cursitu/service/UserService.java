package pepedevelopers.cursitu.service;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import pepedevelopers.cursitu.model.UserEntity;
import pepedevelopers.cursitu.repository.ISubject;
import pepedevelopers.cursitu.repository.IUser;

import java.util.List;

@Service
public class UserService {
  private final IUser userRepo;

  public UserService(IUser userRepo, ISubject subjectRepo) {
    this.userRepo = userRepo;
  }

  @Transactional
  public UserEntity createUser(UserEntity user) {
    List<UserEntity> checkList = userRepo.findAll();

    checkList.forEach(u -> {
      if (user.getDni().equals(u.getDni())) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ya hay un alumno registrado con ese DNI.");
      }
    });

    if ("ALUMNO".equals(user.getRole()) && user.getComission().size() > 1) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Un alumno no puede tener múltiples comisiones.");
    }

    user.setPassword(user.getDni());

    return userRepo.save(user);
  }

  @Transactional
  public UserEntity updateUser(String id, UserEntity update) {
    UserEntity updatedUser = userRepo.findById(id).orElse(null);

    if (updatedUser == null) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado.");
    }

    if ("ALUMNO".equals(update.getRole()) && update.getComission().size() > 1) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Un alumno solo puede tener una comisión.");
    }

    updatedUser.setName(update.getName() == null ? updatedUser.getName() : update.getName());
    updatedUser.setEmail(update.getEmail() == null ? updatedUser.getEmail() : update.getEmail());
    updatedUser.setPassword(update.getPassword() == null ? updatedUser.getPassword() : update.getPassword());
    updatedUser.setDni(update.getDni() == null ? updatedUser.getDni() : update.getDni());
    updatedUser.setRole(update.getRole() == null ? updatedUser.getRole() : update.getRole());
    updatedUser.setComission(update.getComission() == null ? updatedUser.getComission() : update.getComission());
    updatedUser.setClassroom_number(update.getClassroom_number() == null ? updatedUser.getClassroom_number() : update.getClassroom_number());
    updatedUser.setSubjects_id(update.getSubjects_id() == null ? updatedUser.getSubjects_id() : update.getSubjects_id());

    return userRepo.save(updatedUser);
  }

}
