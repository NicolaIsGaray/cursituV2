package pepedevelopers.cursitu.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import pepedevelopers.cursitu.model.classroom_data.TopicsEntity;

public interface ITopics extends MongoRepository<TopicsEntity, String> {
}
