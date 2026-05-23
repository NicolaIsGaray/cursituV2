package pepedevelopers.cursitu.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import pepedevelopers.cursitu.model.ClassroomEntity;
import pepedevelopers.cursitu.model.SubjectEntity;
import pepedevelopers.cursitu.model.dto.ClassroomDTO;
import pepedevelopers.cursitu.model.subject_submodel.AssignmentEntity;
import pepedevelopers.cursitu.model.subject_submodel.TopicEntity;
import pepedevelopers.cursitu.repository.IAssignment;
import pepedevelopers.cursitu.repository.IClassroom;
import pepedevelopers.cursitu.repository.ISubject;
import pepedevelopers.cursitu.repository.ITopics;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class ClassroomService {
  private final IClassroom classroomRepo;
  private final ISubject subjectRepo;
  private final ITopics topicsRepo;
  private final IAssignment assignmentRepo;

  public ClassroomService(IClassroom classroomRepo, ISubject subjectRepo, ITopics topicsRepo, IAssignment assignmentRepo) {
    this.classroomRepo = classroomRepo;
    this.subjectRepo = subjectRepo;
    this.topicsRepo = topicsRepo;
    this.assignmentRepo = assignmentRepo;
  }

  @Transactional
  public void modifyClassroom(String id, ClassroomEntity classroom) {
    ClassroomEntity modified = classroomRepo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Curso no encontrado."));

    modified.setSubject_id(classroom.getSubject_id() == null ? modified.getSubject_id() : classroom.getSubject_id());
    modified.setTopics_id(classroom.getTopics_id() == null ? modified.getTopics_id() : classroom.getTopics_id());
    modified.setStudents_id(classroom.getStudents_id() == null ? modified.getStudents_id() : classroom.getStudents_id());

    classroomRepo.save(modified);
  }

  @Transactional(readOnly = true)
  public ClassroomDTO getClassroomDetailsForView(String classroomId) {
    ClassroomEntity classroom = classroomRepo.findById(classroomId)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Curso no encontrado."));

    String subjectName = "Materia no asignada";
    if (classroom.getSubject_id() != null) {
      subjectName = subjectRepo.findById(classroom.getSubject_id())
        .map(SubjectEntity::getSubject_name)
        .orElse("Materia no encontrada");
    }

    List<TopicEntity> topics = new ArrayList<>();
    if (classroom.getTopics_id() != null && !classroom.getTopics_id().isEmpty()) {
      topics = topicsRepo.findAllById(classroom.getTopics_id());
    }

    return new ClassroomDTO(
      classroom.getId(),
      subjectName,
      topics
    );
  }

  @Transactional
  public List<AssignmentEntity> getOnlyTasksInClassroom(String classroomId) {
    ClassroomEntity classroom = classroomRepo.findById(classroomId).orElseThrow(
      () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Curso no encontrado.")
    );

    List<AssignmentEntity> tasks = new ArrayList<>();

    List<String> topicIds = classroom.getTopics_id();
    if (topicIds != null && !topicIds.isEmpty()) {
      for (String id : topicIds) {
        topicsRepo.findById(id).ifPresent(topic -> {
          if (topic.getAssignmentId() != null) {
            assignmentRepo.findById(topic.getAssignmentId()).ifPresent(task -> {
              if (Objects.equals(task.getType(), "tarea")) {
                tasks.add(task);
              }
            });
          }
        });
      }
    }

    return tasks;
  }

  @Transactional
  public List<AssignmentEntity> getOnlyExamsInClassroom(String classroomId) {
    ClassroomEntity classroom = classroomRepo.findById(classroomId).orElseThrow(
      () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Curso no encontrado.")
    );

    List<AssignmentEntity> exams = new ArrayList<>();

    List<String> topicIds = classroom.getTopics_id();
    if (topicIds != null && !topicIds.isEmpty()) {
      for (String id : topicIds) {
        topicsRepo.findById(id).ifPresent(topic -> {
          if (topic.getAssignmentId() != null) {
            assignmentRepo.findById(topic.getAssignmentId()).ifPresent(exam -> {
              if (Objects.equals(exam.getType(), "parcial")) {
                exams.add(exam);
              }
            });
          }
        });
      }
    }

    return exams;
  }
}
