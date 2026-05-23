package pepedevelopers.cursitu.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import pepedevelopers.cursitu.model.dto.AssignmentDTO;
import pepedevelopers.cursitu.model.subject_submodel.AssignmentEntity;
import pepedevelopers.cursitu.model.subject_submodel.SubmissionEntity;
import pepedevelopers.cursitu.model.subject_submodel.TopicEntity;
import pepedevelopers.cursitu.repository.IAssignment;
import pepedevelopers.cursitu.repository.ISubmission;
import pepedevelopers.cursitu.repository.ITopics;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AssignmentService {
  private final IAssignment assignmentRepo;
  private final ISubmission submissionRepo;
  private final ITopics topicRepo;

  public AssignmentService(IAssignment assignmentRepo, ISubmission submissionRepo, ITopics topicRepo) {
    this.assignmentRepo = assignmentRepo;
    this.submissionRepo = submissionRepo;
    this.topicRepo = topicRepo;
  }

  @Transactional
  public AssignmentEntity updateAssignment(String id, AssignmentEntity update) {
    AssignmentEntity assignment = assignmentRepo.findById(id).orElse(null);

    if (assignment == null) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarea o Parcial no encontrado.");
    }

    assignment.setTitle(update.getTitle() == null ? assignment.getTitle() : update.getTitle());
    assignment.setContent(update.getContent() == null ? assignment.getContent() : update.getContent());
    assignment.setDate_limit(update.getDate_limit() == null ? assignment.getDate_limit() : update.getDate_limit());
    assignment.setEnabled_to_deliver(update.getEnabled_to_deliver() == null ? assignment.getEnabled_to_deliver() : update.getEnabled_to_deliver());
    assignment.setType(update.getType() == null ? assignment.getType() : update.getType());
    assignment.setSentBy(update.getSentBy() == null ? assignment.getSentBy() : update.getSentBy());

    return assignmentRepo.save(assignment);
  }

  public AssignmentEntity getAssignmentInTopic(String assingmentId) {
    AssignmentEntity assignment = assignmentRepo.findById(assingmentId).orElse(null);

    if (assignment == null) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No hay ninguna actividad en la clase.");
    }

    return assignment;
  }

  public List<AssignmentDTO> getPendingAssignmentsForStudent(String studentId) {
    List<AssignmentEntity> allAssignments = assignmentRepo.findAll();
    return allAssignments.stream()
      .map(activity -> {
        Optional<SubmissionEntity> submission = submissionRepo
          .findByActivityIdAndStudentId(activity.getId(), studentId);

        String status = submission.isPresent() ? submission.get().getStatus() : "NO_ENTREGADO";

        return new AssignmentDTO(
          activity.getId(),
          activity.getTitle(),
          activity.getDate_limit(),
          status
        );
      })
      .filter(dto -> "NO_ENTREGADO".equals(dto.status()))
      .collect(Collectors.toList());
  }

  public String checkSubmissionStatus(String studentId, String activityId) {
    AssignmentEntity assignment = assignmentRepo.findById(activityId).orElseThrow(
      () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Actividad no encontrada.")
    );

    Optional<SubmissionEntity> optionalSubmission = submissionRepo.findByActivityIdAndStudentId(activityId, studentId);

    if (optionalSubmission.isEmpty()) {
      return "NO_ENTREGADO";
    }

    SubmissionEntity submission = optionalSubmission.get();

    return submission.getStatus();
  }

  @Transactional
  public SubmissionEntity submitActivity(String activityId, String studentId, SubmissionEntity submission) {
    AssignmentEntity assignment = assignmentRepo.findById(activityId).orElseThrow(
      () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Actividad no encontrada.")
    );

    SubmissionEntity newSubmission = new SubmissionEntity();

    newSubmission.setActivityId(assignment.getId());
    newSubmission.setStudentId(studentId);
    newSubmission.setFile_url(submission.getFile_url());
    newSubmission.setComment(submission.getComment());
    newSubmission.setSubmission_date(submission.getSubmission_date());

    newSubmission.setStatus("ENTREGADO");

    return submissionRepo.save(newSubmission);
  }

  @Transactional
  public List<SubmissionEntity> getAllSubmited() {
    return submissionRepo.findAll();
  }

  @Transactional
  public void deleteSubmited(String id) {
    submissionRepo.deleteById(id);
  }
}
