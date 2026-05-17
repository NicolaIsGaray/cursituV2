package pepedevelopers.cursitu.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pepedevelopers.cursitu.model.SubjectEntity;
import pepedevelopers.cursitu.repository.ISubject;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static java.lang.IO.println;

@RestController
@RequestMapping("/api/subjects")
@CrossOrigin(origins = "*")
public class SubjectController {
    private final ISubject subjectRepo;

    private SubjectController(ISubject iSubject) {
        this.subjectRepo = iSubject;
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
}
