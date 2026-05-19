package pepedevelopers.cursitu.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "classrooms")
@Data
public class ClassroomEntity {
    @Id
    private String id;

    private String subject_id;
    private String[] topics_id;
}
