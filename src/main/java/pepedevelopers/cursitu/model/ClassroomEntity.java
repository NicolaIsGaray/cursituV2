package pepedevelopers.cursitu.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "classrooms")
@Data
public class ClassroomEntity {
    @Id
    private String id;

    private String title;
    private String[] content;
    private String assignment_id;
    private String subject_id;
}
