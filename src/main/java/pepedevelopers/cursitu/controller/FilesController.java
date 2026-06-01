package pepedevelopers.cursitu.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pepedevelopers.cursitu.model.dto.FileDTO;
import pepedevelopers.cursitu.repository.IUser;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "*")
public class FilesController {
  private final IUser userRepo;

  public FilesController(IUser userRepo) {
    this.userRepo = userRepo;
  }
}
