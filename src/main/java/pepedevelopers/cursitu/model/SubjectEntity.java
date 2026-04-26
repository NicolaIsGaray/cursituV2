package pepedevelopers.cursitu.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "subjects")
@Data
public class SubjectEntity {
    @Id
    private String id;

    private String subjectName;
}
