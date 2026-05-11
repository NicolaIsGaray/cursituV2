package pepedevelopers.cursitu.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import pepedevelopers.cursitu.model.UserEntity;

import java.util.Optional;

public interface IUser extends MongoRepository<UserEntity, String> {
  Optional<UserEntity> findByDni(String dni);
}
