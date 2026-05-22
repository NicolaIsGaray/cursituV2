package pepedevelopers.cursitu.model.subject_submodel;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

public record AssignmentDTO(
  String id,
  String title,

  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
  LocalDateTime dateLimit,

  String status
) {}
