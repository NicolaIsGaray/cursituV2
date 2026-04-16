package pepedevelopers.cursitu.controller;

import org.springframework.web.bind.annotation.*;
import pepedevelopers.cursitu.model.SubjectEntity;
import pepedevelopers.cursitu.repository.ISubject;

import java.util.List;

import static java.lang.IO.println;

@RestController
@CrossOrigin("/subject")
public class SubjectController {
    private final ISubject subjectRepo;

    private SubjectController(ISubject iSubject) {
        this.subjectRepo = iSubject;
    }

    @PostMapping("/create-subject")
    public void CreateSubject(SubjectEntity subjectToCreate) {
        SubjectEntity newSubject = new SubjectEntity();

        newSubject.setSubjectName(subjectToCreate.getSubjectName());

        subjectRepo.save(newSubject);

        println("Materia creada con éxito.");
    }

    @GetMapping("/search-subject/{id}")
    public SubjectEntity SearchSubject(@RequestParam String id) {
        return subjectRepo.findById(id).orElse(null);
    }

    @GetMapping("/all-subject")
    public List<SubjectEntity> AllSubjects() {
        return subjectRepo.findAll();
    }

    @PutMapping("/modify-subject/{id}")
    public void ModifySubject(@RequestParam String id, @RequestBody SubjectEntity subjectToUpdate) {
        SubjectEntity updatedSubject = SearchSubject(id);

        if (updatedSubject == null) {
            println("No se ha encontrado la materia.");
            return;
        }

        updatedSubject.setSubjectName(subjectToUpdate.getSubjectName());

        println("Materia actualizada éxitosamente.");
    }

    @DeleteMapping("/delete-subject/{id}")
    public void DeleteSubject(@RequestParam String id) {
        SubjectEntity deletedSubject = SearchSubject(id);

        if (deletedSubject == null) {
            println("No se ha encontrado la materia.");
            return;
        }

        subjectRepo.delete(deletedSubject);

        println("Materia eliminada con éxito.");
    }
}
