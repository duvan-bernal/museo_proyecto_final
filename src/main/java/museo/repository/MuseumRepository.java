package museo.repository;

import java.util.List;
import java.util.Optional;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import museo.model.Museum;

@ApplicationScoped
public class MuseumRepository implements PanacheRepository<Museum> {

    // Buscar un museo exactamente por su nombre
    public Optional<Museum> findByName(String name) {
        return find("name", name).firstResultOptional();
    }

    // Verificar si ya existe un museo con ese nombre (útil al crear)
    public boolean existsByName(String name) {
        return count("name", name) > 0;
    }

    // Listar todos los museos ordenados alfabéticamente por nombre
    public List<Museum> listAllSorted() {
        return list("order by name asc");
    }

}
