package museo.controller;

import java.util.List;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import museo.model.ExhibitionRoom;
import museo.model.Tour;
import museo.model.TourRoom;
import museo.repository.ExhibitionRoomRepository;
import museo.repository.TourRepository;
import museo.repository.TourRoomRepository;


@Path("/recorridos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TourRoomController {

    @Inject
    TourRoomRepository tourRoomRepository;

    @Inject
    TourRepository tourRepository;

    @Inject
    ExhibitionRoomRepository roomRepository;

    // ── SALAS DE UNA VISITA (en orden de secuencia) ───────────
    @GET
    @Path("/visita/{visitaId}")
    public List<TourRoom> findByTour(@PathParam("visitaId") Long visitaId) {
        return tourRoomRepository.findByTour(visitaId);
    }

    // ── VISITAS QUE PASAN POR UNA SALA ───────────────────────
    @GET
    @Path("/sala/{salaId}")
    public List<TourRoom> findByRoom(@PathParam("salaId") Long salaId) {
        return tourRoomRepository.findByExhibitionRoom(salaId);
    }

    // ── ASIGNAR UNA SALA A UNA VISITA ─────────────────────────
    @POST
    @Transactional
    public Response create(TourRoom tourRoom) {
        if (tourRoom.getId() == null
                || tourRoom.getId().getTourId() == null
                || tourRoom.getId().getExhibitionRoomId() == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Se requiere el id de la visita (tourId) y el id de la sala (exhibitionRoomId)")
                    .build();
        }
        Long visitaId = tourRoom.getId().getTourId();
        Long salaId   = tourRoom.getId().getExhibitionRoomId();

        // Verificar que no existe ya ese par
        if (tourRoomRepository.existsByTourAndRoom(visitaId, salaId)) {
            return Response.status(Response.Status.CONFLICT)
                    .entity("La sala " + salaId + " ya está asignada a la visita " + visitaId)
                    .build();
        }
        // Verificar que la visita existe
        Tour tour = tourRepository.findById(visitaId);
        if (tour == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Visita guiada con id " + visitaId + " no encontrada")
                    .build();
        }
        // Verificar que la sala existe
        ExhibitionRoom room = roomRepository.findById(salaId);
        if (room == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Sala con id " + salaId + " no encontrada")
                    .build();
        }
        if (tourRoom.getSequenceNumber() == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("El número de secuencia (orden) es obligatorio")
                    .build();
        }
        tourRoom.setTour(tour);
        tourRoom.setExhibitionRoom(room);
        tourRoomRepository.persist(tourRoom);
        return Response.status(Response.Status.CREATED).entity(tourRoom).build();
    }

    // ── ACTUALIZAR NÚMERO DE SECUENCIA ────────────────────────
    @PUT
    @Path("/{visitaId}/{salaId}")
    @Transactional
    public Response update(
            @PathParam("visitaId") Long visitaId,
            @PathParam("salaId") Long salaId,
            TourRoom datos) {

        TourRoom.TourRoomId pk = new TourRoom.TourRoomId(visitaId, salaId);
        TourRoom tourRoom = tourRoomRepository.findById(pk);
        if (tourRoom == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Recorrido visita=" + visitaId + " sala=" + salaId + " no encontrado")
                    .build();
        }
        if (datos.getSequenceNumber() == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("El número de secuencia es obligatorio")
                    .build();
        }
        tourRoom.setSequenceNumber(datos.getSequenceNumber());
        return Response.ok(tourRoom).build();
    }

    // ── QUITAR UNA SALA DE UNA VISITA ─────────────────────────
    @DELETE
    @Path("/{visitaId}/{salaId}")
    @Transactional
    public Response delete(
            @PathParam("visitaId") Long visitaId,
            @PathParam("salaId") Long salaId) {

        TourRoom.TourRoomId pk = new TourRoom.TourRoomId(visitaId, salaId);
        TourRoom tourRoom = tourRoomRepository.findById(pk);
        if (tourRoom == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Recorrido visita=" + visitaId + " sala=" + salaId + " no encontrado")
                    .build();
        }
        tourRoomRepository.delete(tourRoom);
        return Response.noContent().build();
    }
}

