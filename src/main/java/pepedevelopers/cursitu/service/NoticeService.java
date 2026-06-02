package pepedevelopers.cursitu.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import pepedevelopers.cursitu.model.NoticeEntity;
import pepedevelopers.cursitu.model.UserEntity;
import pepedevelopers.cursitu.repository.INotice;
import pepedevelopers.cursitu.repository.IUser;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class NoticeService {
  private final INotice noticeRepo;
  private final IUser userRepo;

  public NoticeService(INotice noticeRepo, IUser userRepo) {
    this.noticeRepo = noticeRepo;
    this.userRepo = userRepo;
  }

  @Transactional
  public NoticeEntity createNotice(NoticeEntity notice, String senderId) {
    if (notice == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Aviso no válido.");
    }

    if (senderId.isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID del emisor no válido.");
    }

    List<String> emisor = new ArrayList<>();
    emisor.add(senderId);

    notice.setReadBy(emisor);

    return noticeRepo.save(notice);
  }

  @Transactional
  public List<NoticeEntity> obtainSenderNotices(String senderId) {
    return noticeRepo.findBySenderId(senderId).orElseThrow(
      () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Avisos del emisor no encontrados.")
    );
  }

  @Transactional
  public void updateNotice(String id, NoticeEntity updates) {
    NoticeEntity notice = noticeRepo.findById(id).orElseThrow(
      () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Aviso no encontrado.")
    );

    notice.setTitle(updates.getTitle() == null ? notice.getTitle() : updates.getTitle());
    notice.setMessage(updates.getMessage() == null ? notice.getMessage() : updates.getMessage());
    notice.setReadBy(new ArrayList<>());
    notice.setType(updates.getType() == null ? "info" : updates.getType());
    notice.setCreated_at(updates.getCreated_at() == null ? notice.getCreated_at() : updates.getCreated_at());

    noticeRepo.save(notice);
  }

  @Transactional
  public List<NoticeEntity> showNotRead(String studentId) {
    List<NoticeEntity> notices = noticeRepo.findAll();
    List<NoticeEntity> notRead = new ArrayList<>();

    if (!notices.isEmpty()) {
      notices.forEach(notice -> {
        userRepo.findById(studentId).ifPresent(student -> {
          if (notice.getReadBy().isEmpty()) {
            notRead.add(notice);
          } else {
            for (String readerId : notice.getReadBy()) {
              if (!Objects.equals(student.getId(), readerId) || notice.getReadBy().isEmpty()) {
                notRead.add(notice);
              }
            }
          }
        });
      });
    }

    return notRead;
  }

  @Transactional
  public void checkAndUpdateReadStatus(String noticeId, String userId) {
    NoticeEntity notice = noticeRepo.findById(noticeId).orElseThrow(
      () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Aviso no encontrado.")
    );

    userRepo.findById(userId).ifPresent(user -> {

      if (notice.getReadBy() == null) {
        notice.setReadBy(new ArrayList<>());
      }

      if (!notice.getReadBy().contains(user.getId())) {
        notice.getReadBy().add(user.getId());

        noticeRepo.save(notice);
      }
    });
  }
}
