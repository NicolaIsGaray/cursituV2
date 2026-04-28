package pepedevelopers.cursitu.model.subject_data;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "student_grades")
@Data
public class GradesEntity {
  @Id
  private String id;

  private String student_id;
  private String task_id;
  private float qualification;
  private LocalDateTime created_at;
}
