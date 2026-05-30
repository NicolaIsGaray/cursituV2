package pepedevelopers.cursitu.model.dto;

import java.util.List;

public record GroupDTO(
  String memberName,
  String memberRole,
  String memberComission,
  Integer groupNumber,
  List<String> memberIds,
  String subjectId
) {}
