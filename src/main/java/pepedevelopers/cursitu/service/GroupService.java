package pepedevelopers.cursitu.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import pepedevelopers.cursitu.model.GroupEntity;
import pepedevelopers.cursitu.model.SubjectEntity;
import pepedevelopers.cursitu.model.UserEntity;
import pepedevelopers.cursitu.model.dto.AssignmentDTO;
import pepedevelopers.cursitu.model.dto.GroupDTO;
import pepedevelopers.cursitu.model.subject_submodel.AssignmentEntity;
import pepedevelopers.cursitu.model.subject_submodel.SubmissionEntity;
import pepedevelopers.cursitu.repository.IGroup;
import pepedevelopers.cursitu.repository.ISubject;
import pepedevelopers.cursitu.repository.IUser;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class GroupService {
  private final IGroup groupRepo;
  private final IUser userRepo;
  private final ISubject subjectRepo;

  public GroupService(IGroup groupRepo, IUser userRepo, ISubject subjectRepo) {
    this.groupRepo = groupRepo;
    this.userRepo = userRepo;
    this.subjectRepo = subjectRepo;
  }

  @Transactional
  public GroupEntity createNewGroup(GroupEntity group) {
    List<GroupEntity> groupCheck = groupRepo.findAll();

    groupCheck.forEach(check -> {
      if (Objects.equals(group.getNumber(), check.getNumber())) {
        throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya hay un grupo con ese número.");
      }
    });

    List<UserEntity> groupMembers = userRepo.findAllById(group.getMembersId());

    if (!groupMembers.isEmpty()) {
      groupMembers.forEach(member -> {
        member.setHasGroup(true);
        userRepo.save(member);
      });

      List<String> memberNames = groupMembers.stream().map(
        UserEntity::getName
      ).toList();

      group.setMember_names(memberNames);
    }

    return groupRepo.save(group);
  }

  @Transactional
  public void updateGroup(String id, GroupEntity updates) {
    GroupEntity group = groupRepo.findById(id).orElseThrow(
      () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Grupo no encontrado.")
    );

    group.setNumber(updates.getNumber() == null ? group.getNumber() : updates.getNumber());
    group.setGroup_limit(updates.getGroup_limit() == null ? group.getGroup_limit() : updates.getGroup_limit());
    group.setClassroom_id(updates.getClassroom_id() == null ? group.getClassroom_id() : updates.getClassroom_id());
    group.setProfessor_id(updates.getProfessor_id() == null ? group.getProfessor_id() : updates.getProfessor_id());
    group.setSubjectId(updates.getSubjectId() == null ? group.getSubjectId() : updates.getSubjectId());

    List<String> newMemberIds = updates.getMembersId() != null ? updates.getMembersId() : group.getMembersId();
    List<String> oldMemberIds = group.getMembersId();

    List<String> removedStudentIds = oldMemberIds.stream()
      .filter(oldId -> !newMemberIds.contains(oldId))
      .toList();

    if (!removedStudentIds.isEmpty()) {
      List<UserEntity> removedMembers = userRepo.findAllById(removedStudentIds);
      removedMembers.forEach(member -> member.setHasGroup(false));
      userRepo.saveAll(removedMembers);
    }

    List<String> addedStudentIds = newMemberIds.stream()
      .filter(newId -> !oldMemberIds.contains(newId))
      .toList();

    if (!addedStudentIds.isEmpty()) {
      List<UserEntity> addedMembers = userRepo.findAllById(addedStudentIds);
      addedMembers.forEach(member -> member.setHasGroup(true));
      userRepo.saveAll(addedMembers);
    }

    group.setMembersId(newMemberIds);

    List<UserEntity> currentMembers = userRepo.findAllById(newMemberIds);
    List<String> memberNames = currentMembers.stream()
      .map(UserEntity::getName)
      .toList();

    group.setMember_names(memberNames);

    groupRepo.save(group);
  }

  @Transactional
  public void deleteGroupAndRemoveMembers(String groupId) {
    groupRepo.findById(groupId).ifPresent(g -> {
      List<UserEntity> membersToRemove = userRepo.findAllById(g.getMembersId());

      if (!membersToRemove.isEmpty()) {
        membersToRemove.forEach(member -> {
          member.setHasGroup(false);
          userRepo.save(member);
        });
      }

      groupRepo.delete(g);
    });
  }

  @Transactional(readOnly = true)
  public List<GroupEntity> obtainGroupListBySubject(String subjectId) {
    List<GroupEntity> groupList = groupRepo.findAll();

    if (groupList.isEmpty()) {
      return List.of();
    }

    return groupList.stream()
      .filter(group -> Objects.equals(group.getSubjectId(), subjectId))
      .toList();
  }

  @Transactional
  public List<GroupDTO> showStudentAssignedGroups(String memberId, String subjectId) {
    GroupEntity group = groupRepo.findByMembersIdAndSubjectId(memberId, subjectId).orElse(null);

    if (group == null) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "El usuario no pertenece a ningun grupo.");
    }

    List<UserEntity> groupMembers = userRepo.findAllById(group.getMembersId());

    return groupMembers.stream().map(member -> new GroupDTO(
      member.getName() == null ? null : member.getName(),
      member.getRole() == null ? null : member.getRole(),
      String.join(", ", member.getComission()).isEmpty() ? null : String.join(", ", member.getComission()),
      group.getNumber() == null ? null : group.getNumber(),
      group.getMembersId() == null ? null : group.getMembersId(),
      group.getSubjectId() == null ? null : group.getSubjectId()
    )).toList();
  }
}
