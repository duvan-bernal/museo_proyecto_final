package museo.repository;

import java.util.List;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import museo.model.Artifact;

@ApplicationScoped
public class ArtifactRepository implements PanacheRepository<Artifact> {

    // Obras que están exhibidas en una sala específica
    public List<Artifact> findByExhibitionRoom(Long roomId) {
        return list("exhibitionRoom.id", roomId);
    }

    // Obras que pertenecen a una categoría (ej: todas las pinturas)
    public List<Artifact> findByCategory(Long categoryId) {
        return list("category.id", categoryId);
    }

    // Obras creadas por un artista específico
    public List<Artifact> findByArtist(Long artistId) {
        return list("artist.id", artistId);
    }

    

    // Cuántas obras hay en una sala específica
    public long countByExhibitionRoom(Long roomId) {
        return count("exhibitionRoom.id", roomId);
    }

    // Todas las obras ordenadas por nombre
    public List<Artifact> listAllSorted() {
        return list("order by name asc");
    }

}
