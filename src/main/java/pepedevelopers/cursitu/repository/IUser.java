package pepedevelopers.cursitu.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import pepedevelopers.cursitu.model.UserEntity;

public interface IUser extends MongoRepository<UserEntity, String> {
}
