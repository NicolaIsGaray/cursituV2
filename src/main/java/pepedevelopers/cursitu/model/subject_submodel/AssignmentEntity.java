package pepedevelopers.cursitu.model.subject_submodel;

import java.time.LocalDateTime;

public class AssignmentEntity {
  private String subject_id;
  private boolean enabled;
  private String title;
  private String content;
  private LocalDateTime date_limit;
  private String allowed_format;
}
