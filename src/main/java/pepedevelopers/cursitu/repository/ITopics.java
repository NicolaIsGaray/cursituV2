package pepedevelopers.cursitu.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import pepedevelopers.cursitu.model.subject_submodel.TopicsEntity;

public interface ITopics extends MongoRepository<TopicsEntity, String> {
}
