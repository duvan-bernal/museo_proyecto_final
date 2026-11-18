package museo.controller;

import java.time.LocalDateTime;
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
import museo.model.Tour;
import museo.repository.TourRepository;


@Path("/visitas")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TourController {

    @Inject
    TourRepository tourRepository;

    // ── LISTAR TODAS ──────────────────────────────────────────
    @GET
    public List<Tour> listAll() {
        return tourRepository.listAllSorted();
    }

    // ── BUSCAR POR ID ─────────────────────────────────────────
    @GET
    @Path("/{id}")
    public Response findById(@PathParam("id") Long id) {
        Tour tour = tourRepository.findById(id);
        if (tour == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Visita guiada con id " + id + " no encontrada")
                    .build();
        }
        return Response.ok(tour).build();
    }

    // ── VISITAS ACTIVAS EN ESTE MOMENTO ───────────────────────
    @GET
    @Path("/activas")
    public List<Tour> findActive() {
        return tourRepository.findActive(LocalDateTime.now());
    }

    // ── CREAR ─────────────────────────────────────────────────
    @POST
    @Transactional
    public Response create(Tour tour) {
        if (tour.getName() == null || tour.getName().isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("El nombre de la visita guiada es obligatorio")
                    .build();
        }
        if (tour.getStartAt() == null || tour.getEndAt() == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Las fechas de inicio y fin de la visita son obligatorias")
                    .build();
        }
        if (tour.getEndAt().isBefore(tour.getStartAt())) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("La fecha de fin no puede ser anterior a la fecha de inicio")
                    .build();
        }
        tourRepository.persist(tour);
        return Response.status(Response.Status.CREATED).entity(tour).build();
    }

    // ── ACTUALIZAR ────────────────────────────────────────────
    @PUT
    @Path("/{id}")
    @Transactional
    public Response update(@PathParam("id") Long id, Tour datos) {
        Tour tour = tourRepository.findById(id);
        if (tour == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Visita guiada con id " + id + " no encontrada")
                    .build();
        }
        if (datos.getEndAt() != null && datos.getStartAt() != null
                && datos.getEndAt().isBefore(datos.getStartAt())) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("La fecha de fin no puede ser anterior a la fecha de inicio")
                    .build();
        }
        tour.setName(datos.getName());
        tour.setDescription(datos.getDescription());
        tour.setStartAt(datos.getStartAt());
        tour.setEndAt(datos.getEndAt());
        tour.setUrl(datos.getUrl());
        tour.setImageUrl(datos.getImageUrl());
        return Response.ok(tour).build();
    }

    // ── ELIMINAR ──────────────────────────────────────────────
    @DELETE
    @Path("/{id}")
    @Transactional
    public Response delete(@PathParam("id") Long id) {
        Tour tour = tourRepository.findById(id);
        if (tour == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Visita guiada con id " + id + " no encontrada")
                    .build();
        }
        tourRepository.delete(tour);
        return Response.noContent().build();
    }
}
