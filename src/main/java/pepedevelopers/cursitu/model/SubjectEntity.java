package pepedevelopers.cursitu.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import pepedevelopers.cursitu.model.subject_data.ClassEntity;
import pepedevelopers.cursitu.model.subject_data.DateEntity;

import java.util.List;

@Document(collection = "subjects")
@Data
public class SubjectEntity {
    @Id
    private String id;

    private String subject_name;
    private String color;
    private String professor_id;

    private List<ClassEntity> classes;
    private List<DateEntity> important_dates;
}
