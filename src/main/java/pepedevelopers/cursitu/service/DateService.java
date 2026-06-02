package pepedevelopers.cursitu.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import pepedevelopers.cursitu.model.subject_submodel.AssignmentEntity;
import pepedevelopers.cursitu.model.subject_submodel.DateEntity;
import pepedevelopers.cursitu.repository.IAssignment;
import pepedevelopers.cursitu.repository.IDate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class DateService {
  private final IDate dateRepo;
  private final IAssignment assignmentRepo;

  public DateService(IDate dateRepo, IAssignment assignmentRepo) {
    this.dateRepo = dateRepo;
    this.assignmentRepo = assignmentRepo;
  }

  @Transactional
  public void updateDateEvent(String id, DateEntity updates) {
    DateEntity dateEntity = dateRepo.findById(id).orElseThrow(
      () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Fecha no encontrada.")
    );

    dateEntity.setTitle(updates.getTitle() == null ? dateEntity.getTitle() : updates.getTitle());
    dateEntity.setDate(updates.getDate() == null ? dateEntity.getDate() : updates.getDate());
    dateEntity.setEvent(updates.getEvent() == null ? dateEntity.getEvent() : updates.getEvent());
    dateEntity.setImportant(updates.getImportant() == null ? dateEntity.getImportant() : updates.getImportant());

    dateRepo.save(dateEntity);
  }

  @Transactional
  public void createExamDate(String examId) {
    AssignmentEntity exam = assignmentRepo.findById(examId).orElseThrow(
      () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Parcial no encontrado.")
    );

    DateEntity examDate = new DateEntity();

    examDate.setTitle(exam.getTitle());
    examDate.setSubjectId(exam.getSubject_id());
    examDate.setEvent("EXAMEN");
    examDate.setDate(exam.getDate_limit());
    examDate.setImportant(true);

    dateRepo.save(examDate);
  }
}
