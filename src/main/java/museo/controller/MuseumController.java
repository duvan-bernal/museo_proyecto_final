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
import museo.model.Museum;
import museo.repository.MuseumRepository;

@Path("/museos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class MuseumController {

    @Inject
    MuseumRepository museumRepository;

    // ── LISTAR TODOS ──────────────────────────────────────────
    @GET
    public List<Museum> listAll() {
        return museumRepository.listAllSorted();
    }

    // ── BUSCAR POR ID ─────────────────────────────────────────
    @GET
    @Path("/{id}")
    public Response findById(@PathParam("id") Long id) {
        Museum museum = museumRepository.findById(id);
        if (museum == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Museo con id " + id + " no encontrado")
                    .build();
        }
        return Response.ok(museum).build();
    }

    // ── CREAR ─────────────────────────────────────────────────
    @POST
    @Transactional
    public Response create(Museum museum) {
        if (museum.getName() == null || museum.getName().isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("El nombre del museo es obligatorio")
                    .build();
        }
        if (museumRepository.existsByName(museum.getName())) {
            return Response.status(Response.Status.CONFLICT)
                    .entity("Ya existe un museo con el nombre: " + museum.getName())
                    .build();
        }
        museumRepository.persist(museum);
        return Response.status(Response.Status.CREATED).entity(museum).build();
    }

    // ── ACTUALIZAR ────────────────────────────────────────────
    @PUT
    @Path("/{id}")
    @Transactional
    public Response update(@PathParam("id") Long id, Museum datos) {
        Museum museum = museumRepository.findById(id);
        if (museum == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Museo con id " + id + " no encontrado")
                    .build();
        }
        museum.setName(datos.getName());
        museum.setDescription(datos.getDescription());
        museum.setLatitude(datos.getLatitude());
        museum.setLongitude(datos.getLongitude());
        museum.setUrl(datos.getUrl());
        museum.setImageUrl(datos.getImageUrl());
        return Response.ok(museum).build();
    }

    // ── ELIMINAR ──────────────────────────────────────────────
    @DELETE
    @Path("/{id}")
    @Transactional
    public Response delete(@PathParam("id") Long id) {
        Museum museum = museumRepository.findById(id);
        if (museum == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Museo con id " + id + " no encontrado")
                    .build();
        }
        museumRepository.delete(museum);
        return Response.noContent().build();
    }
}
