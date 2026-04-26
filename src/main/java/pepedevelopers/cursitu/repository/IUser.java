package pepedevelopers.cursitu.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import pepedevelopers.cursitu.model.user.UserEntity;

import java.util.Optional;

public interface IUser extends MongoRepository<UserEntity, String> {
}
