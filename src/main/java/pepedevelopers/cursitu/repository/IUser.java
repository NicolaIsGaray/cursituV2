package pepedevelopers.cursitu.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import pepedevelopers.cursitu.model.user.UserEntity;

public interface IUser extends MongoRepository<UserEntity, String> {
    UserEntity findByDni(String dni);
}
