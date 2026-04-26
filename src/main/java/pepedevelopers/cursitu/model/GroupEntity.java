package pepedevelopers.cursitu.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import pepedevelopers.cursitu.model.user.UserEntity;

import java.util.List;

@Document(collection = "groups")
@Data
public class GroupEntity {
    @Id
    private String id;

    private List<String> membersId;
    private Integer number;
    private Integer groupLimit;
    private String subjectId;
    private String professorId;
    private String classroomId;
}
