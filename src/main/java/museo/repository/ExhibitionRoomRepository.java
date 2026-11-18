package museo.repository;

import java.util.List;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import museo.model.ExhibitionRoom;

@ApplicationScoped
public class ExhibitionRoomRepository implements PanacheRepository<ExhibitionRoom> {

    // Todas las salas que pertenecen a un museo específico
    public List<ExhibitionRoom> findByMuseum(Long museumId) {
        return list("museum.id", museumId);
    }

    // Cuántas salas tiene un museo
    public long countByMuseum(Long museumId) {
        return count("museum.id", museumId);
    }

    // Todas las salas ordenadas por nombre
    public List<ExhibitionRoom> listAllSorted() {
        return list("order by name asc");
    }

}