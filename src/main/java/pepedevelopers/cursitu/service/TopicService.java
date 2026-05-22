package pepedevelopers.cursitu.service;

import org.springframework.stereotype.Service;
import pepedevelopers.cursitu.repository.ITopics;

@Service
public class TopicService {
  private final ITopics topicRepo;

  public TopicService(ITopics topicRepo) {
    this.topicRepo = topicRepo;
  }

}
