package pepedevelopers.cursitu.controller;

import org.springframework.web.bind.annotation.*;
import pepedevelopers.cursitu.model.ClassroomEntity;
import pepedevelopers.cursitu.model.user.UserEntity;
import pepedevelopers.cursitu.repository.IClassroom;

import java.util.ArrayList;
import java.util.List;

import static java.lang.IO.println;

@RestController
@CrossOrigin("/classroom")
public class ClassroomController {
    private final UserController userController;

    private final IClassroom classRepo;

    private ClassroomController(IClassroom classRepo, UserController userController) {
        this.classRepo = classRepo;
        this.userController = userController;
    }

    @PostMapping("/create-classroom")
    public void CreateClassroom(ClassroomEntity classroomToCreate, List<UserEntity> students) {
        ClassroomEntity classroom = new ClassroomEntity();

        classroom.setNumber(classroomToCreate.getNumber());
        classroom.setStudents(students);

        classRepo.save(classroom);

        println("Curso creado éxitosamente.");
    }

    @GetMapping("/search/{classNum}")
    public ClassroomEntity SearchClassroom(@RequestParam Integer classroomNumber) {
        return classRepo.findByNumber(classroomNumber);
    }

    @GetMapping("/all-classrooms")
    public List<ClassroomEntity> AllClassrooms() {
        return classRepo.findAll();
    }

    @PutMapping("/modify-classroom/{classNum}")
    public void ModifyClassroom(@RequestParam Integer classroomNumber, ClassroomEntity classroomToUpdate) {
        ClassroomEntity modifiedClassroom = SearchClassroom(classroomNumber);

        if (modifiedClassroom == null) {
            println("Curso no encontrado.");
            return;
        }

        modifiedClassroom.setNumber(classroomToUpdate.getNumber());
        modifiedClassroom.setStudents(classroomToUpdate.getStudents());

        classRepo.save(modifiedClassroom);

        println("Curso modificado éxitosamente.");
    }

    @DeleteMapping("/delete-classroom/{classNum}")
    public void DeleteClassroom(@RequestParam Integer classroomNumber) {
        ClassroomEntity deletedClassroom = SearchClassroom(classroomNumber);

        if (deletedClassroom == null) {
            println("Curso no encontrado.");
            return;
        }

        classRepo.delete(deletedClassroom);

        println("Curso eliminado con éxito.");
    }

    @PostMapping("/add-student/{classNum}/{studentId}")
    public void AddStudent(@RequestParam Integer classroomNumber, @RequestParam String studentId) {
        ClassroomEntity classroomAssigned = SearchClassroom(classroomNumber);

        if (classroomAssigned == null) {
            println("Curso no encontrado.");
            return;
        }

        UserEntity studentToAssign = userController.SearchUser(studentId);

        if (studentToAssign == null) {
            println("No se ha encontrado al alumno a asignar");
            return;
        }

        List<UserEntity> studentToList = new ArrayList<>();
        studentToList.add(studentToAssign);

        classroomAssigned.setStudents(studentToList);

        println("Alumno asignado al curso " + classroomNumber + " éxitosamente.");
    }

    @DeleteMapping("/remove-student/{classNum}/{studentId}")
    public void RemoveStudent(@RequestParam Integer classroomNumber, @RequestParam String studentId) {
        ClassroomEntity classroomTarget = SearchClassroom(classroomNumber);

        if (classroomTarget == null) {
            println("Curso no encontrado.");
            return;
        }

        UserEntity studentToRemove = userController.SearchUser(studentId);

        if (studentToRemove == null) {
            println("No se ha encontrado al alumno a quitar.");
            return;
        }

        List<UserEntity> studentsList = classroomTarget.getStudents();

        studentsList.removeIf(student -> student == studentToRemove);

        classroomTarget.setStudents(studentsList);

        println("Alumno quitado del curso con éxito.");
    }
}
