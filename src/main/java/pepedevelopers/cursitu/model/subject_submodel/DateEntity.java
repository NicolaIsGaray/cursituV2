package pepedevelopers.cursitu.model.subject_submodel;

import lombok.Data;
import org.springframework.data.annotation.Id;

import java.util.Date;

@Data
public class DateEntity {
  @Id
  private String id;

  private String event;
  private Boolean important;
  private Date date;
}
