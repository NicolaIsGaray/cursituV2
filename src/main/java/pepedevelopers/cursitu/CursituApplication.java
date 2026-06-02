package pepedevelopers.cursitu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CursituApplication {

	public static void main(String[] args) {
		SpringApplication.run(CursituApplication.class, args);
	}
}
