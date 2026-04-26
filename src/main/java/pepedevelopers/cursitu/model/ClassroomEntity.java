package pepedevelopers.cursitu.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import pepedevelopers.cursitu.model.user.UserEntity;

import java.util.List;

@Document(collection = "classrooms")
@Data
public class ClassroomEntity {
    @Id
    private String id;

    private Integer number;
    private List<String> studentsId;
}
