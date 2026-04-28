package pepedevelopers.cursitu.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "notices")
@Data
public class NoticesEntity {
  @Id
  private String id;

  private String title;
  private String message;
  private String emisor_id;
  private LocalDateTime created_at;
  private String[] read_by;
}
