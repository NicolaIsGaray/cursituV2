package pepedevelopers.cursitu.controller.subject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pepedevelopers.cursitu.model.dto.AssignmentDTO;
import pepedevelopers.cursitu.model.subject_submodel.AssignmentEntity;
import pepedevelopers.cursitu.model.subject_submodel.SubmissionEntity;
import pepedevelopers.cursitu.model.subject_submodel.TopicEntity;
import pepedevelopers.cursitu.repository.IAssignment;
import pepedevelopers.cursitu.service.AssignmentService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/assignment")
@CrossOrigin(origins = "*")
public class AssignmentController {
  @Autowired
  private AssignmentService assignmentService;

  private final IAssignment assignRepo;

  public AssignmentController(IAssignment assignRepo) {
    this.assignRepo = assignRepo;
  }

  @PostMapping
  public ResponseEntity<AssignmentEntity> addAssignment(@RequestBody AssignmentEntity newAssignment) {
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
    AssignmentEntity assignment = assignmentService.updateAssignment(id, modified);

    if (assignment == null) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se ha podido modificar la tarea o parcial.");
    }

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

  @GetMapping("/in-topic/{id}")
  public ResponseEntity<AssignmentEntity> getAssignmentInTopic(@PathVariable String id) {
    return ResponseEntity.ok(assignmentService.getAssignmentInTopic(id));
  }

  @GetMapping("/check-status")
  public ResponseEntity<Map<String, String>> checkAssignmentSubmissionStatus(@RequestParam String studentId, @RequestParam String activityId) {
    String status = assignmentService.checkSubmissionStatus(studentId, activityId);

    return ResponseEntity.ok(Map.of("status", status));
  }

  @GetMapping("/student/{id}/pending")
  public ResponseEntity<List<AssignmentDTO>> getStudentPendings(@PathVariable String id) {
    List<AssignmentDTO> list = assignmentService.getPendingAssignmentsForStudent(id);

    if (list == null || list.isEmpty()) {
      return ResponseEntity.notFound().build();
    }

    return ResponseEntity.ok(list);
  }

  @PostMapping("/submit-activity")
  public ResponseEntity<SubmissionEntity> submitAssignment(
    @RequestParam String activityId,
    @RequestParam String studentId,
    @RequestBody SubmissionEntity submission) {

    SubmissionEntity submited = assignmentService.submitActivity(activityId, studentId, submission);

    if (submited == null) {
      return ResponseEntity.notFound().build();
    }

    return ResponseEntity.ok(submited);
  }

  @GetMapping("/submited")
  public ResponseEntity<List<SubmissionEntity>> getAllSubmitedAssignments() {
    return ResponseEntity.ok(assignmentService.getAllSubmited());
  }

  @DeleteMapping("/submited/{id}")
  public ResponseEntity<?> deleteSubmited(@PathVariable String id) {
    assignmentService.deleteSubmited(id);
    return ResponseEntity.ok(Map.of("message", "Entrega eliminada con éxito."));
  }
}
