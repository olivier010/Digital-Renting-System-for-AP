import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import javax.sql.DataSource;

@SpringBootTest
class BackendApplicationTests {

    @MockBean
    DataSource dataSource;  // ← prevents Spring from connecting to real DB

    @Test
    void contextLoads() {
    }
}
