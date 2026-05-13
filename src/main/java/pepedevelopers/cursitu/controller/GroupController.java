package pepedevelopers.cursitu.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pepedevelopers.cursitu.model.GroupEntity;
import pepedevelopers.cursitu.repository.IGroup;

import java.util.List;

import static java.lang.IO.println;

@RestController
@RequestMapping("/api/groups")
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

    @GetMapping("/{id}")
    public ResponseEntity<GroupEntity> searchGroup(@PathVariable String id) {
        GroupEntity group = groupRepo.findById(id).orElse(null);

        return group != null ? ResponseEntity.ok(group) : ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<List<GroupEntity>> allGroups() {
        return ResponseEntity.ok(groupRepo.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> modifyGroup(@PathVariable String id, @RequestBody GroupEntity groupToUpdate) {
        GroupEntity groupUpdated = groupRepo.findById(id).orElse(null);

        if (groupUpdated == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Grupo no encontrado.");
        }

        groupUpdated.setMembers_id(groupToUpdate.getMembers_id() == null ? groupUpdated.getMembers_id() : groupToUpdate.getMembers_id());
        groupUpdated.setNumber(groupToUpdate.getNumber() == null ? groupUpdated.getNumber() : groupToUpdate.getNumber());
        groupUpdated.setGroup_limit(groupToUpdate.getGroup_limit() == null ? groupUpdated.getGroup_limit() : groupToUpdate.getGroup_limit());
        groupUpdated.setClassroom_id(groupToUpdate.getClassroom_id() == null ? groupUpdated.getClassroom_id() : groupToUpdate.getClassroom_id());
        groupUpdated.setProfessor_id(groupToUpdate.getProfessor_id() == null ? groupUpdated.getProfessor_id() : groupToUpdate.getProfessor_id());
        groupUpdated.setSubject_id(groupToUpdate.getSubject_id() == null ? groupUpdated.getSubject_id() : groupToUpdate.getSubject_id());

        groupRepo.save(groupUpdated);

        return ResponseEntity.ok("Grupo modificado correctamente.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteGroup(@PathVariable String id) {
        GroupEntity deletedGroup = groupRepo.findById(id).orElse(null);

        if (deletedGroup == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Grupo no encontrado.");
        }

        groupRepo.delete(deletedGroup);

        return ResponseEntity.ok("Grupo eliminado exitosamente.");
    }
}
