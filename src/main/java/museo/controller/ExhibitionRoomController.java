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
import museo.model.Museum;
import museo.repository.ExhibitionRoomRepository;
import museo.repository.MuseumRepository;


@Path("/salas")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ExhibitionRoomController {

    @Inject
    ExhibitionRoomRepository roomRepository;

    @Inject
    MuseumRepository museumRepository;

    // ── LISTAR TODAS ──────────────────────────────────────────
    @GET
    public List<ExhibitionRoom> listAll() {
        return roomRepository.listAllSorted();
    }

    // ── BUSCAR POR ID ─────────────────────────────────────────
    @GET
    @Path("/{id}")
    public Response findById(@PathParam("id") Long id) {
        ExhibitionRoom room = roomRepository.findById(id);
        if (room == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Sala con id " + id + " no encontrada")
                    .build();
        }
        return Response.ok(room).build();
    }

    // ── SALAS DE UN MUSEO ─────────────────────────────────────
    @GET
    @Path("/museo/{museoId}")
    public List<ExhibitionRoom> findByMuseum(@PathParam("museoId") Long museoId) {
        return roomRepository.findByMuseum(museoId);
    }

    // ── CREAR ─────────────────────────────────────────────────
    @POST
    @Transactional
    public Response create(ExhibitionRoom room) {
        if (room.getName() == null || room.getName().isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("El nombre de la sala es obligatorio")
                    .build();
        }
        if (room.getMuseum() == null || room.getMuseum().getId() == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("El museo de la sala es obligatorio")
                    .build();
        }
        // Verificar que el museo existe
        Museum museum = museumRepository.findById(room.getMuseum().getId());
        if (museum == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Museo con id " + room.getMuseum().getId() + " no encontrado")
                    .build();
        }
        room.setMuseum(museum);
        roomRepository.persist(room);
        return Response.status(Response.Status.CREATED).entity(room).build();
    }

    // ── ACTUALIZAR ────────────────────────────────────────────
    @PUT
    @Path("/{id}")
    @Transactional
    public Response update(@PathParam("id") Long id, ExhibitionRoom datos) {
        ExhibitionRoom room = roomRepository.findById(id);
        if (room == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Sala con id " + id + " no encontrada")
                    .build();
        }
        room.setName(datos.getName());
        room.setDescription(datos.getDescription());
        room.setCapacity(datos.getCapacity());
        room.setImageUrl(datos.getImageUrl());
        // Cambiar museo si viene uno nuevo
        if (datos.getMuseum() != null && datos.getMuseum().getId() != null) {
            Museum museum = museumRepository.findById(datos.getMuseum().getId());
            if (museum == null) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity("Museo con id " + datos.getMuseum().getId() + " no encontrado")
                        .build();
            }
            room.setMuseum(museum);
        }
        return Response.ok(room).build();
    }

    // ── ELIMINAR ──────────────────────────────────────────────
    @DELETE
    @Path("/{id}")
    @Transactional
    public Response delete(@PathParam("id") Long id) {
        ExhibitionRoom room = roomRepository.findById(id);
        if (room == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Sala con id " + id + " no encontrada")
                    .build();
        }
        roomRepository.delete(room);
        return Response.noContent().build();
    }
}
