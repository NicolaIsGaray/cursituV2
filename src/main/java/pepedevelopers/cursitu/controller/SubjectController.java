package pepedevelopers.cursitu.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pepedevelopers.cursitu.model.SubjectEntity;
import pepedevelopers.cursitu.model.UserEntity;
import pepedevelopers.cursitu.repository.ISubject;
import pepedevelopers.cursitu.repository.IUser;

import java.util.*;

import static java.lang.IO.println;

@Slf4j
@RestController
@RequestMapping("/api/subjects")
@CrossOrigin(origins = "*")
public class SubjectController {
  private final ISubject subjectRepo;
  private final IUser userRepo;

  private SubjectController(ISubject iSubject, IUser userRepo) {
    this.subjectRepo = iSubject;
    this.userRepo = userRepo;
  }

  @PostMapping
  public ResponseEntity<SubjectEntity> createSubject(@RequestBody SubjectEntity subjectToCreate) {
      return new ResponseEntity<>(subjectRepo.save(subjectToCreate), HttpStatus.CREATED);
  }

  @GetMapping("/{id}")
  public ResponseEntity<SubjectEntity> searchSubject(@PathVariable String id) {
      SubjectEntity requestedSubject = subjectRepo.findById(id).orElse(null);

      return requestedSubject != null ? ResponseEntity.ok(requestedSubject) : ResponseEntity.notFound().build();
  }

  @GetMapping
  public ResponseEntity<List<SubjectEntity>> allSubjects() {
      return ResponseEntity.ok(subjectRepo.findAll());
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> modifySubject(@PathVariable String id, @RequestBody SubjectEntity subjectToUpdate) {
      SubjectEntity updatedSubject = subjectRepo.findById(id).orElse(null);

      if (updatedSubject == null) {
          return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Materia no encontrada.");
      }

      updatedSubject.setSubject_name(subjectToUpdate.getSubject_name() == null ? updatedSubject.getSubject_name() : subjectToUpdate.getSubject_name());
      updatedSubject.setColor(subjectToUpdate.getColor() == null ? (updatedSubject.getColor() == null ? "#000000" : updatedSubject.getColor()) : subjectToUpdate.getColor());
      updatedSubject.setImportant_dates(subjectToUpdate.getImportant_dates() == null ? updatedSubject.getImportant_dates() : subjectToUpdate.getImportant_dates());
      updatedSubject.setProfessor_id(subjectToUpdate.getProfessor_id() == null ? updatedSubject.getProfessor_id() : subjectToUpdate.getProfessor_id());
      updatedSubject.setClassroom_id(subjectToUpdate.getClassroom_id() == null ? updatedSubject.getClassroom_id() : subjectToUpdate.getClassroom_id());
      updatedSubject.setYear_level(subjectToUpdate.getYear_level() == null ? updatedSubject.getYear_level() : subjectToUpdate.getYear_level());
      updatedSubject.setAcademic_period(subjectToUpdate.getAcademic_period() == null ? updatedSubject.getAcademic_period() : subjectToUpdate.getAcademic_period());
      updatedSubject.setIsSuspended(subjectToUpdate.getIsSuspended() != null && subjectToUpdate.getIsSuspended());

      subjectRepo.save(updatedSubject);

      Map<String, String> response = new HashMap<>();
      response.put("message", "Materia modificada con éxito.");

      return ResponseEntity.ok(response);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteSubject(@PathVariable String id) {
      SubjectEntity deletedSubject = subjectRepo.findById(id).orElse(null);

      if (deletedSubject == null) {
          return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Materia no encontrada.");
      }

      subjectRepo.delete(deletedSubject);

      Map<String, String> response = new HashMap<>();
      response.put("message", "Materia eliminada con éxito.");

      return ResponseEntity.ok(response);
  }

  @GetMapping("/student/{id}")
  public ResponseEntity<List<SubjectEntity>> getStudentSubjects(@PathVariable String id) {
    UserEntity student = userRepo.findById(id).orElse(null);

    if (student == null) {
      log.info("Error. No se ha podido encontrar al estudiante.");
      return ResponseEntity.notFound().build();
    }

    String[] subjectsIdArray = student.getSubjects_id();
    if (subjectsIdArray == null || subjectsIdArray.length == 0) {
      log.info("No hay materias vinculadas al estudiante.");
      return ResponseEntity.ok(new ArrayList<>());
    }

    List<SubjectEntity> toSend = subjectRepo.findByIdInAndIsSuspendedFalse(Arrays.asList(subjectsIdArray));
    return ResponseEntity.ok(toSend);
  }

  @GetMapping("/professor/{id}")
  public ResponseEntity<List<SubjectEntity>> getProfessorSubjects(@PathVariable String id) {
    UserEntity professor = userRepo.findById(id).orElse(null);

    if (professor == null) {
      log.info("Error. No se ha podido encontrar al profesor.");
      return ResponseEntity.notFound().build();
    }

    String[] subjectsIdArray = professor.getSubjects_id();
    if (subjectsIdArray == null || subjectsIdArray.length == 0) {
      log.info("No hay materias vinculadas al profesor.");
      return ResponseEntity.ok(new ArrayList<>());
    }

    List<SubjectEntity> toSend = subjectRepo.findByIdInAndIsSuspendedFalse(Arrays.asList(subjectsIdArray));
    return ResponseEntity.ok(toSend);
  }

  @GetMapping("/professor/in")
  public ResponseEntity<List<UserEntity>> getProfessorInSubjects(@RequestParam List<String> ids) {
    if (ids == null || ids.isEmpty()) {
      log.info("No hay IDs. Creando lista vacia...");
      return ResponseEntity.ok(new ArrayList<>());
    }

    List<SubjectEntity> subjectsFound = subjectRepo.findByIdInAndIsSuspendedFalse(ids);

    List<String> professorIds = subjectsFound.stream()
      .map(SubjectEntity::getProfessor_id)
      .filter(profId -> profId != null && !profId.isEmpty())
      .distinct()
      .toList();

    List<UserEntity> professorsFound = new ArrayList<>();
    if (!professorIds.isEmpty()) {
      professorsFound = userRepo.findByIdIn(professorIds);
    }

    if (professorsFound.isEmpty()) {
      log.info("No hay profesores vinculados.");
      return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    return ResponseEntity.ok(professorsFound);
  }
}
