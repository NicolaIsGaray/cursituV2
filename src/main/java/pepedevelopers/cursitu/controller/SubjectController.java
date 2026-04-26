package pepedevelopers.cursitu.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pepedevelopers.cursitu.model.SubjectEntity;
import pepedevelopers.cursitu.repository.ISubject;

import java.util.List;

import static java.lang.IO.println;

@RestController
@RequestMapping("/subjects")
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
    public ResponseEntity<String> modifySubject(@PathVariable String id, @RequestBody SubjectEntity subjectToUpdate) {
        SubjectEntity updatedSubject = subjectRepo.findById(id).orElse(null);

        if (updatedSubject == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Materia no encontrada.");
        }

        updatedSubject.setSubjectName(subjectToUpdate.getSubjectName());

        subjectRepo.save(updatedSubject);

        return ResponseEntity.ok("Materia modificada.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSubject(@PathVariable String id) {
        SubjectEntity deletedSubject = subjectRepo.findById(id).orElse(null);

        if (deletedSubject == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Materia no encontrada.");
        }

        subjectRepo.delete(deletedSubject);

        return ResponseEntity.ok("Materia eliminada exitosamente.");
    }
}
