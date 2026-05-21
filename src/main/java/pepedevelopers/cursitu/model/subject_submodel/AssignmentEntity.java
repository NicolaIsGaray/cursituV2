package pepedevelopers.cursitu.model.subject_submodel;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "assignments")
public class AssignmentEntity {
  @Id
  private String id;

  private String subject_id;
  private Boolean enabled_to_deliver;
  private String title;
  private String content;
  private LocalDateTime date_limit;
  private String allowed_format;
  private String type;
  private String[] sentBy;
}
