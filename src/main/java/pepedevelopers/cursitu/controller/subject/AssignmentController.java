package pepedevelopers.cursitu.controller.subject;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pepedevelopers.cursitu.model.subject_submodel.AssignmentEntity;
import pepedevelopers.cursitu.repository.IAssignment;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/assignment")
@CrossOrigin(origins = "*")
public class AssignmentController {
  private final IAssignment assignRepo;

  public AssignmentController(IAssignment assignRepo) {
    this.assignRepo = assignRepo;
  }

  @PostMapping
  public ResponseEntity<AssignmentEntity> createAssignment(@RequestBody AssignmentEntity newAssignment) {
    return new ResponseEntity<>(assignRepo.save(newAssignment), HttpStatus.CREATED);
  }

  @GetMapping("/{id}")
  public ResponseEntity<AssignmentEntity> getAssignmentById(@PathVariable String id) {
    AssignmentEntity request = assignRepo.findById(id).orElse(null);

    return request != null ? ResponseEntity.ok(request) : ResponseEntity.notFound().build();
  }

  @GetMapping
  public ResponseEntity<List<AssignmentEntity>> getAllAssignments() {
    return ResponseEntity.ok(assignRepo.findAll());
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> modifyAssignment(@PathVariable String id, @RequestBody AssignmentEntity modified) {
    AssignmentEntity existing = assignRepo.findById(id).orElse(null);

    if (existing == null) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Tarea o Parcial no encontrado.");
    }

    existing.setTitle(modified.getTitle() == null ? existing.getTitle() : modified.getTitle());
    existing.setContent(modified.getContent() == null ? existing.getContent() : modified.getContent());
    existing.setDate_limit(modified.getDate_limit() == null ? existing.getDate_limit() : modified.getDate_limit());
    existing.setEnabled_to_deliver(modified.getEnabled_to_deliver() == null ? existing.getEnabled_to_deliver() : modified.getEnabled_to_deliver());
    existing.setType(modified.getType() == null ? existing.getType() : modified.getType());
    existing.setDelivered(modified.getDelivered() == null ? existing.getDelivered() : modified.getDelivered());

    Map<String, String> response = new HashMap<>();
    response.put("message", "Tarea o Parcial modificado con éxito.");

    return ResponseEntity.ok(response);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteAssignment(@PathVariable String id) {
    AssignmentEntity deleting = assignRepo.findById(id).orElse(null);

    if (deleting == null) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Tarea o Parcial no encontrado.");
    }

    assignRepo.delete(deleting);

    Map<String, String> response = new HashMap<>();
    response.put("message", "Tarea o Parcial eliminado con éxito.");

    return ResponseEntity.ok(response);
  }
}
