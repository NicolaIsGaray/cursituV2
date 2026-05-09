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
@RequestMapping("/classrooms")
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

    @GetMapping("/{classNum}")
    public ResponseEntity<ClassroomEntity> searchClassroom(@PathVariable Integer classNum) {
        ClassroomEntity classroom = classRepo.findByNumber(classNum);
        return classroom != null ? ResponseEntity.ok(classroom) : ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<List<ClassroomEntity>> getAllClassrooms() {
        return ResponseEntity.ok(classRepo.findAll());
    }

    @PutMapping("/{classNum}")
    public ResponseEntity<String> modifyClassroom(@PathVariable Integer classNum, @RequestBody ClassroomEntity updatedData) {
        ClassroomEntity existingClassroom = classRepo.findByNumber(classNum);
        String[] studentsEmpty = {};

        if (existingClassroom == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Curso no encontrado.");

        existingClassroom.setTitle(updatedData.getTitle());
        existingClassroom.setContent(updatedData.getContent());
        existingClassroom.setSubject_id(updatedData.getSubject_id());
        existingClassroom.setAssignment_id(updatedData.getAssignment_id());
        classRepo.save(existingClassroom);

        return ResponseEntity.ok("Curso modificado exitosamente.");
    }

    @DeleteMapping("/{classNum}")
    public ResponseEntity<String> deleteClassroom(@PathVariable Integer classNum) {
        ClassroomEntity classroom = classRepo.findByNumber(classNum);

        if (classroom == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Curso no encontrado.");

        classRepo.delete(classroom);
        return ResponseEntity.ok("Curso eliminado con éxito.");
    }
}
