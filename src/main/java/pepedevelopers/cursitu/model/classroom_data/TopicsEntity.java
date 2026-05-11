package pepedevelopers.cursitu.model.classroom_data;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "topics")
public class TopicsEntity {
  @Id
  private String id;

  private String title;
  private String[] content;
  private String assignment_id;
}
