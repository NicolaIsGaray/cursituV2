package pepedevelopers.cursitu.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import pepedevelopers.cursitu.model.ClassroomEntity;

public interface IClassroom extends MongoRepository<ClassroomEntity, String> {
    ClassroomEntity findByNumber(Integer number);
}
