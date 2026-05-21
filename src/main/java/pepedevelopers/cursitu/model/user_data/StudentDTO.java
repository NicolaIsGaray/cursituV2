package pepedevelopers.cursitu.model.user_data;

public record StudentDTO(String name, String email, String password, String dni, String role, String[] comission, Integer classroom_number, String[] subjects_id) { }
