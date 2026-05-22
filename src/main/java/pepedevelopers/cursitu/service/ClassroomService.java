package pepedevelopers.cursitu.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import pepedevelopers.cursitu.model.ClassroomEntity;
import pepedevelopers.cursitu.model.SubjectEntity;
import pepedevelopers.cursitu.model.subject_submodel.AssignmentEntity;
import pepedevelopers.cursitu.repository.IAssignment;
import pepedevelopers.cursitu.repository.IClassroom;
import pepedevelopers.cursitu.repository.ITopics;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class ClassroomService {
  private final IClassroom classroomRepo;
  private final ITopics topicsRepo;
  private final IAssignment assignmentRepo;

  public ClassroomService(IClassroom classroomRepo, ITopics topicsRepo, IAssignment assignmentRepo) {
    this.classroomRepo = classroomRepo;
    this.topicsRepo = topicsRepo;
    this.assignmentRepo = assignmentRepo;
  }

  @Transactional
  public List<AssignmentEntity> getAllAssignmentsInClassroom(String classroomId) {
    ClassroomEntity classroom = classroomRepo.findById(classroomId).orElseThrow(
      () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Curso no encontrado.")
    );

    List<AssignmentEntity> assignments = new ArrayList<>();

    List<String> topicIds = classroom.getTopics_id();
    if (topicIds != null && !topicIds.isEmpty()) {
      for (String id : topicIds) {
        topicsRepo.findById(id).ifPresent(topic -> {
          if (topic.getAssignment_id() != null) {
            assignments.add(assignmentRepo.findById(topic.getAssignment_id()).orElseThrow(
              () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarea o parcial no encontrados.")
            ));
          }
        });
      }
    }

    return assignments;
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
          if (topic.getAssignment_id() != null) {
            assignmentRepo.findById(topic.getAssignment_id()).ifPresent(task -> {
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
          if (topic.getAssignment_id() != null) {
            assignmentRepo.findById(topic.getAssignment_id()).ifPresent(exam -> {
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
