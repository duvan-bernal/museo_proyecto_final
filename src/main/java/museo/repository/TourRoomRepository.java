package museo.repository;

import java.util.List;
import java.util.Optional;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import museo.model.TourRoom;

@ApplicationScoped
public class TourRoomRepository implements PanacheRepositoryBase<TourRoom, TourRoom.TourRoomId> {

    // Todas las salas de una visita guiada, ordenadas por número de secuencia (1ª,
    // 2ª, 3ª...)
    public List<TourRoom> findByTour(Long tourId) {
        return list("id.tourId = ?1 order by sequenceNumber", tourId);
    }

    // Todas las visitas en las que aparece una sala específica
    public List<TourRoom> findByExhibitionRoom(Long roomId) {
        return list("id.exhibitionRoomId", roomId);
    }

    // Buscar un recorrido específico por visita y sala (clave compuesta)
    public Optional<TourRoom> findByTourAndRoom(Long tourId, Long roomId) {
        return find("id.tourId = ?1 and id.exhibitionRoomId = ?2", tourId, roomId)
                .firstResultOptional();
    }

    // Cuántas salas tiene una visita guiada
    public long countByTour(Long tourId) {
        return count("id.tourId", tourId);
    }

    // Verificar si una sala ya está asignada a una visita
    public boolean existsByTourAndRoom(Long tourId, Long roomId) {
        return count("id.tourId = ?1 and id.exhibitionRoomId = ?2", tourId, roomId) > 0;
    }

}