package pepedevelopers.cursitu.model.user;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import pepedevelopers.cursitu.model.SubjectEntity;

import java.util.List;

@Document(collection = "users")
@Data
public class UserEntity {
    @Id
    private String id;
    private String name;
    private String email;
    private String password;
    private String dni;
    private UserRole role = UserRole.ALUMNO;
    private String comission;
    private List<SubjectEntity> subjects;
}
