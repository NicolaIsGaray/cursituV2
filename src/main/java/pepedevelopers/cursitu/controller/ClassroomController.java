package pepedevelopers.cursitu.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pepedevelopers.cursitu.model.ClassroomEntity;
import pepedevelopers.cursitu.model.user.UserEntity;
import pepedevelopers.cursitu.repository.IClassroom;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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
        List<String> students = new ArrayList<>();

        classroom.setStudentsId(students);

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

        if (existingClassroom == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Curso no encontrado.");

        existingClassroom.setNumber(updatedData.getNumber());
        existingClassroom.setStudentsId(updatedData.getStudentsId() == null ? new ArrayList<>() : updatedData.getStudentsId());
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

    @PostMapping("/{classNum}/students/{studentId}")
    public ResponseEntity<String> addStudent(@PathVariable Integer classNum, @PathVariable String studentId) {
        ClassroomEntity classroom = classRepo.findByNumber(classNum);
        if (classroom == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Curso no encontrado.");

        UserEntity student = userController.searchUser(studentId);

        String memberId = student.getId();

        List<String> students = classroom.getStudentsId();

        if (!students.contains(memberId)) {
            students.add(memberId);
            classroom.setStudentsId(students);
            classRepo.save(classroom);
        }

        return ResponseEntity.ok("Alumno asignado exitosamente.");
    }

    @DeleteMapping("/{classNum}/students/{studentId}")
    public ResponseEntity<String> removeStudent(@PathVariable Integer classNum, @PathVariable String studentId) {
        ClassroomEntity classroom = classRepo.findByNumber(classNum);
        if (classroom == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Curso no encontrado.");

        UserEntity student = userController.searchUser(studentId);
        if (student == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Alumno no encontrado.");

        boolean removed = classroom.getStudentsId().removeIf(s -> s.equals(student.getId()));

        if (removed) {
            classRepo.save(classroom);
            return ResponseEntity.ok("Alumno quitado con éxito.");
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El alumno no pertenecía al curso.");
    }
}