package pepedevelopers.cursitu.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pepedevelopers.cursitu.model.ClassroomEntity;
import pepedevelopers.cursitu.model.GroupEntity;
import pepedevelopers.cursitu.model.SubjectEntity;
import pepedevelopers.cursitu.model.user.UserEntity;
import pepedevelopers.cursitu.model.user.UserRole;
import pepedevelopers.cursitu.repository.IGroup;

import java.util.List;

import static java.lang.IO.println;

@RestController
@RequestMapping("/groups")
@CrossOrigin(origins = "*")
public class GroupController {
    private final IGroup groupRepo;

    private GroupController(IGroup groupRepo) {
        this.groupRepo = groupRepo;
    }

    @PostMapping
    public ResponseEntity<GroupEntity> createGroup(@RequestBody GroupEntity group) {
        return new ResponseEntity<>(groupRepo.save(group), HttpStatus.CREATED);
    }

    @GetMapping("/{groupNum}")
    public ResponseEntity<GroupEntity> searchGroup(@PathVariable Integer groupNumber) {
        GroupEntity group = groupRepo.findByNumber(groupNumber);

        return group != null ? ResponseEntity.ok(group) : ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<List<GroupEntity>> allGroups() {
        return ResponseEntity.ok(groupRepo.findAll());
    }

    @PutMapping("/{groupNum}")
    public ResponseEntity<String> modifyGroup(@PathVariable Integer groupNum, @RequestBody GroupEntity groupToUpdate) {
        GroupEntity groupUpdated = groupRepo.findByNumber(groupNum);

        if (groupUpdated == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Grupo no encontrado.");
        }

        groupUpdated.setMembersId(groupToUpdate.getMembersId());
        groupUpdated.setNumber(groupToUpdate.getNumber());
        groupUpdated.setGroupLimit(groupToUpdate.getGroupLimit());
        groupUpdated.setClassroomId(groupToUpdate.getClassroomId());
        groupUpdated.setProfessorId(groupToUpdate.getProfessorId());
        groupUpdated.setSubjectId(groupToUpdate.getSubjectId());

        groupRepo.save(groupUpdated);

        return ResponseEntity.ok("Grupo modificado correctamente.");
    }

    @DeleteMapping("/{groupNum}")
    public ResponseEntity<String> deleteGroup(@PathVariable Integer groupNum) {
        GroupEntity deletedGroup = groupRepo.findByNumber(groupNum);

        if (deletedGroup == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Grupo no encontrado.");
        }

        groupRepo.delete(deletedGroup);

        return ResponseEntity.ok("Grupo eliminado exitosamente.");
    }
}
