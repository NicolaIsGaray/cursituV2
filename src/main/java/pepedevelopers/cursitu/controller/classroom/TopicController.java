package pepedevelopers.cursitu.controller.classroom;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pepedevelopers.cursitu.model.classroom_data.TopicsEntity;
import pepedevelopers.cursitu.repository.classroom.ITopics;

import java.util.List;

@RestController
@RequestMapping("/api/topics")
@CrossOrigin(origins = "*")
public class TopicController {
  private final ITopics topicsRepo;

  public TopicController(ITopics topicsRepo) {
    this.topicsRepo = topicsRepo;
  }

  @PostMapping
  public ResponseEntity<TopicsEntity> createTopic(@RequestBody TopicsEntity newTopic) {
    return new ResponseEntity<>(topicsRepo.save(newTopic), HttpStatus.CREATED);
  }

  @GetMapping
  public ResponseEntity<List<TopicsEntity>> getAllTopics() {
    return ResponseEntity.ok(topicsRepo.findAll());
  }

  @GetMapping("/{id}")
  public ResponseEntity<TopicsEntity> getTopicById(@PathVariable String id) {
    TopicsEntity topic = topicsRepo.findById(id).orElse(null);

    return topic != null ? ResponseEntity.ok(topic) : ResponseEntity.notFound().build();
  }

  @PutMapping("/{id}")
  public ResponseEntity<String> modifyTopic(@PathVariable String id, @RequestBody TopicsEntity updatedTopic) {
    TopicsEntity existingTopic = topicsRepo.findById(id).orElse(null);

    if (existingTopic == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se ha encontrado");

    existingTopic.setTitle(updatedTopic.getTitle() == null ? existingTopic.getTitle() : updatedTopic.getTitle());
    existingTopic.setContent(updatedTopic.getContent() == null ? existingTopic.getContent() : updatedTopic.getContent());
    existingTopic.setAssignment_id(updatedTopic.getAssignment_id() == null ? existingTopic.getAssignment_id() : updatedTopic.getAssignment_id());

    topicsRepo.save(existingTopic);

    return ResponseEntity.ok("Tema actualizado exitosamente.");
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<String> deleteTopic(@PathVariable String id) {
    TopicsEntity existingTopic = topicsRepo.findById(id).orElse(null);

    if (existingTopic == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Tema no encontrado");

    topicsRepo.delete(existingTopic);
    return ResponseEntity.ok("Tema eliminado exitosamente.");
  }
}
