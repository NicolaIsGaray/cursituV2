package pepedevelopers.cursitu.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pepedevelopers.cursitu.model.ClassroomEntity;
import pepedevelopers.cursitu.repository.IClassroom;
import pepedevelopers.cursitu.model.UserEntity;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/classrooms")
@CrossOrigin(origins = "*")
public class ClassroomController {

    private final UserController userController;
    private final IClassroom classRepo;

    public ClassroomController(IClassroom classRepo, UserController userController) {
        this.classRepo = classRepo;
        this.userController = userController;
    }

    @PostMapping
    public ResponseEntity<ClassroomEntity> createClassroom(@RequestBody ClassroomEntity classroom) {
        return new ResponseEntity<>(classRepo.save(classroom), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClassroomEntity> searchClassroom(@PathVariable String id) {
        ClassroomEntity classroom = classRepo.findById(id).orElse(null);
        return classroom != null ? ResponseEntity.ok(classroom) : ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<List<ClassroomEntity>> getAllClassrooms() {
        return ResponseEntity.ok(classRepo.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> modifyClassroom(@PathVariable String id, @RequestBody ClassroomEntity updatedData) {
        ClassroomEntity existingClassroom = classRepo.findById(id).orElse(null);

        if (existingClassroom == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Curso no encontrado.");

        existingClassroom.setSubject_id(updatedData.getSubject_id() == null ? existingClassroom.getSubject_id() : updatedData.getSubject_id());
        existingClassroom.setTopics_id(updatedData.getTopics_id() == null ? existingClassroom.getTopics_id() : updatedData.getTopics_id());
        classRepo.save(existingClassroom);

        return ResponseEntity.ok("Curso modificado exitosamente.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteClassroom(@PathVariable String id) {
        ClassroomEntity classroom = classRepo.findById(id).orElse(null);

        if (classroom == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Curso no encontrado.");

        classRepo.delete(classroom);
        return ResponseEntity.ok("Curso eliminado con éxito.");
    }
}
