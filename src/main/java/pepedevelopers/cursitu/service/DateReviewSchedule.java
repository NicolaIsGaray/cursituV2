package pepedevelopers.cursitu.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pepedevelopers.cursitu.model.subject_submodel.DateEntity;
import pepedevelopers.cursitu.repository.IAssignment;
import pepedevelopers.cursitu.repository.IDate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class DateReviewSchedule {
  private final IDate dateRepo;
  private final IAssignment assignmentRepo;

  public DateReviewSchedule(IDate dateRepo, IAssignment assignmentRepo) {
    this.dateRepo = dateRepo;
    this.assignmentRepo = assignmentRepo;
  }

  @Scheduled(fixedRate = 1800000)
  @Transactional
  public void dateStatus() {
    List<DateEntity> dateList = dateRepo.findAll();

    LocalDateTime now = LocalDateTime.now();

    List<DateEntity> toRemove = new ArrayList<>();

    if (!dateList.isEmpty()) {
      dateList.forEach(date -> {
        if (now.isAfter(date.getDate())) {
          toRemove.add(date);
        }
      });
    }

    dateRepo.deleteAll(toRemove);
    System.out.println("[SCHEDULER] Se eliminaron " + toRemove.size() + " fechas que ya cumplieron su tiempo estimado.");
  }
}
