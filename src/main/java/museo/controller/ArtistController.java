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
import museo.model.Artist;
import museo.repository.ArtistRepository;


@Path("/artistas")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ArtistController {

    @Inject
    ArtistRepository artistRepository;

    // ── LISTAR TODOS ──────────────────────────────────────────
    @GET
    public List<Artist> listAll() {
        return artistRepository.listAll();
    }

    // ── BUSCAR POR ID ─────────────────────────────────────────
    @GET
    @Path("/{id}")
    public Response findById(@PathParam("id") Long id) {
        Artist artist = artistRepository.findById(id);
        if (artist == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Artista con id " + id + " no encontrado")
                    .build();
        }
        return Response.ok(artist).build();
    }

    // ── BUSCAR POR NACIONALIDAD ───────────────────────────────
    @GET
    @Path("/nacionalidad/{nacionalidad}")
    public List<Artist> findByNationality(@PathParam("nacionalidad") String nacionalidad) {
        return artistRepository.findByNationality(nacionalidad);
    }

    // ── CREAR ─────────────────────────────────────────────────
    @POST
    @Transactional
    public Response create(Artist artist) {
        if (artist.getName() == null || artist.getName().isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("El nombre del artista es obligatorio")
                    .build();
        }
        artistRepository.persist(artist);
        return Response.status(Response.Status.CREATED).entity(artist).build();
    }

    // ── ACTUALIZAR ────────────────────────────────────────────
    @PUT
    @Path("/{id}")
    @Transactional
    public Response update(@PathParam("id") Long id, Artist datos) {
        Artist artist = artistRepository.findById(id);
        if (artist == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Artista con id " + id + " no encontrado")
                    .build();
        }
        artist.setName(datos.getName());
        artist.setBiography(datos.getBiography());
        artist.setNationality(datos.getNationality());
        artist.setImageUrl(datos.getImageUrl());
        return Response.ok(artist).build();
    }

    // ── ELIMINAR ──────────────────────────────────────────────
    @DELETE
    @Path("/{id}")
    @Transactional
    public Response delete(@PathParam("id") Long id) {
        Artist artist = artistRepository.findById(id);
        if (artist == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Artista con id " + id + " no encontrado")
                    .build();
        }
        artistRepository.delete(artist);
        return Response.noContent().build();
    }
}
