package pepedevelopers.cursitu.controller;

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
@CrossOrigin("/group")
public class GroupController {
    private final IGroup groupRepo;

    private GroupController(IGroup groupRepo) {
        this.groupRepo = groupRepo;
    }

    @PostMapping("/create-group")
    public void CreateGroup(GroupEntity group, List<UserEntity> members, SubjectEntity subject, UserEntity professor, ClassroomEntity classroom) {
        if (professor.getRole() != UserRole.DOCENTE) {
            println("Error. No se ha encontrado un docente asignado al grupo.");
            return;
        }

        GroupEntity newGroup = new GroupEntity();

        newGroup.setNumber(group.getNumber());
        newGroup.setGroupLimit(group.getGroupLimit());
        newGroup.setClassroom(classroom);
        newGroup.setMembers(members);
        newGroup.setProfessor(professor);
        newGroup.setSubject(group.getSubject());

        groupRepo.save(newGroup);

        println("Grupo creado éxitosamente.");
    }

    @GetMapping("/search-group/{groupNum}")
    public GroupEntity SearchGroup(@RequestParam Integer groupNumber) {
        return groupRepo.findByNumber(groupNumber);
    }

    @GetMapping("/all")
    public List<GroupEntity> AllGroups() {
        return groupRepo.findAll();
    }

    @PutMapping("/modify/{id}")
    public void ModifyGroup(@RequestParam Integer groupNumber, @RequestBody GroupEntity groupToUpdate) {
        GroupEntity groupUpdated = SearchGroup(groupNumber);

        if (groupUpdated == null) {
            println("No se ha encontrado el grupo.");
            return;
        }

        groupUpdated.setNumber(groupToUpdate.getNumber());
        groupUpdated.setGroupLimit(groupToUpdate.getGroupLimit());
        groupUpdated.setMembers(groupToUpdate.getMembers());
        groupUpdated.setSubject(groupToUpdate.getSubject());
        groupUpdated.setProfessor(groupToUpdate.getProfessor());
        groupUpdated.setClassroom(groupToUpdate.getClassroom());

        groupRepo.save(groupUpdated);

        println("Grupo modificado con éxito.");
    }

    @DeleteMapping("/delete-group/{groupNum}")
    public void DeleteGroup(@RequestParam Integer groupNumber) {
        GroupEntity deletedGroup = SearchGroup(groupNumber);

        if (deletedGroup == null) {
            println("Error. No existe el grupo.");
            return;
        }

        groupRepo.delete(deletedGroup);

        println("Grupo eliminado con éxito.");
    }
}
