package pepedevelopers.cursitu.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import pepedevelopers.cursitu.model.SubjectEntity;

public interface ISubject extends MongoRepository<SubjectEntity, String> {
}
