package museo.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import museo.model.Tour;

@ApplicationScoped
public class TourRepository implements PanacheRepository<Tour> {

    // Buscar una visita exactamente por su nombre
    public Optional<Tour> findByName(String name) {
        return find("name", name).firstResultOptional();
    }

    // Buscar visitas que empiecen después de una fecha dada
    public List<Tour> findStartingAfter(LocalDateTime date) {
        return list("startAt >= ?1 order by startAt asc", date);
    }

    // Buscar visitas que empiecen antes de una fecha dada
    public List<Tour> findStartingBefore(LocalDateTime date) {
        return list("startAt <= ?1 order by startAt asc", date);
    }

    // Buscar visitas activas ahora mismo (entre fecha inicio y fin)
    public List<Tour> findActive(LocalDateTime now) {
        return list("startAt <= ?1 and endAt >= ?1 order by startAt asc", now);
    }

    // Listar todas las visitas ordenadas por fecha de inicio (más próxima primero)
    public List<Tour> listAllSorted() {
        return list("order by startAt asc");
    }

}