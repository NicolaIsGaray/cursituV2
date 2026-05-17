package pepedevelopers.cursitu.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import pepedevelopers.cursitu.model.NoticeEntity;

public interface INotice extends MongoRepository<NoticeEntity, String> {
}
