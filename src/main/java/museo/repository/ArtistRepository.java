package museo.repository;

import java.util.List;
import java.util.Optional;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import museo.model.Artist;

@ApplicationScoped
public class ArtistRepository implements PanacheRepository<Artist> {

    // Buscar todos los artistas de una nacionalidad (ej: "Colombiano")
    public List<Artist> findByNationality(String nationality) {
        return list("nationality", nationality);
    }

    // Buscar un artista exactamente por su nombre
    public Optional<Artist> findByName(String name) {
        return find("name", name).firstResultOptional();
    }

    // Verificar si ya existe un artista con ese nombre (útil al crear)
    public boolean existsByName(String name) {
        return count("name", name) > 0;
    }

}
