package pepedevelopers.cursitu.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import pepedevelopers.cursitu.model.subject_submodel.SubmissionEntity;

import java.util.Optional;

public interface ISubmission extends MongoRepository<SubmissionEntity, String> {
  Optional<SubmissionEntity> findByActivityIdAndStudentId(String activityId, String studentId);
}
