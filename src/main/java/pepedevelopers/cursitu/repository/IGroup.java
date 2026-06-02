package pepedevelopers.cursitu.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import pepedevelopers.cursitu.model.GroupEntity;

import java.util.List;
import java.util.Optional;

public interface IGroup extends MongoRepository<GroupEntity, String> {
  Optional<GroupEntity> findBySubjectId(String subjectId);
  Optional<GroupEntity> findByMembersIdAndSubjectId(String membersId, String subjectId);
}
