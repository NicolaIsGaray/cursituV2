package pepedevelopers.cursitu.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import pepedevelopers.cursitu.model.subject_submodel.TopicEntity;

public interface ITopics extends MongoRepository<TopicEntity, String> {
}
