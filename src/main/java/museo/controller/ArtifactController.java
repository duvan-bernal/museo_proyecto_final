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
import museo.model.Artifact;
import museo.model.Artist;
import museo.model.Category;
import museo.model.ExhibitionRoom;
import museo.repository.ArtifactRepository;
import museo.repository.ArtistRepository;
import museo.repository.CategoryRepository;
import museo.repository.ExhibitionRoomRepository;


 
@Path("/obras")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ArtifactController {

    @Inject
    ArtifactRepository artifactRepository;

    @Inject
    ArtistRepository artistRepository;

    @Inject
    CategoryRepository categoryRepository;

    @Inject
    ExhibitionRoomRepository roomRepository;

    // ── LISTAR TODAS ──────────────────────────────────────────
    @GET
    public List<Artifact> listAll() {
        return artifactRepository.listAllSorted();
    }

    // ── BUSCAR POR ID ─────────────────────────────────────────
    @GET
    @Path("/{id}")
    public Response findById(@PathParam("id") Long id) {
        Artifact artifact = artifactRepository.findById(id);
        if (artifact == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Obra con id " + id + " no encontrada")
                    .build();
        }
        return Response.ok(artifact).build();
    }

    // ── OBRAS EN UNA SALA ─────────────────────────────────────
    @GET
    @Path("/sala/{salaId}")
    public List<Artifact> findByRoom(@PathParam("salaId") Long salaId) {
        return artifactRepository.findByExhibitionRoom(salaId);
    }

    // ── OBRAS DE UNA CATEGORÍA ────────────────────────────────
    @GET
    @Path("/categoria/{categoriaId}")
    public List<Artifact> findByCategory(@PathParam("categoriaId") Long categoriaId) {
        return artifactRepository.findByCategory(categoriaId);
    }

    // ── OBRAS DE UN ARTISTA ───────────────────────────────────
    @GET
    @Path("/artista/{artistaId}")
    public List<Artifact> findByArtist(@PathParam("artistaId") Long artistaId) {
        return artifactRepository.findByArtist(artistaId);
    }

    // ── CREAR ─────────────────────────────────────────────────
    @POST
    @Transactional
    public Response create(Artifact artifact) {
        if (artifact.getName() == null || artifact.getName().isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("El nombre de la obra es obligatorio")
                    .build();
        }
        // Validar y cargar categoría
        if (artifact.getCategory() == null || artifact.getCategory().getId() == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("La categoría de la obra es obligatoria")
                    .build();
        }
        Category category = categoryRepository.findById(artifact.getCategory().getId());
        if (category == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Categoría con id " + artifact.getCategory().getId() + " no encontrada")
                    .build();
        }
        // Validar y cargar sala
        if (artifact.getExhibitionRoom() == null || artifact.getExhibitionRoom().getId() == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("La sala de exposición de la obra es obligatoria")
                    .build();
        }
        ExhibitionRoom room = roomRepository.findById(artifact.getExhibitionRoom().getId());
        if (room == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Sala con id " + artifact.getExhibitionRoom().getId() + " no encontrada")
                    .build();
        }
        // Cargar artista (opcional)
        if (artifact.getArtist() != null && artifact.getArtist().getId() != null) {
            Artist artist = artistRepository.findById(artifact.getArtist().getId());
            if (artist == null) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity("Artista con id " + artifact.getArtist().getId() + " no encontrado")
                        .build();
            }
            artifact.setArtist(artist);
        }
        artifact.setCategory(category);
        artifact.setExhibitionRoom(room);
        artifactRepository.persist(artifact);
        return Response.status(Response.Status.CREATED).entity(artifact).build();
    }

    // ── ACTUALIZAR ────────────────────────────────────────────
    @PUT
    @Path("/{id}")
    @Transactional
    public Response update(@PathParam("id") Long id, Artifact datos) {
        Artifact artifact = artifactRepository.findById(id);
        if (artifact == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Obra con id " + id + " no encontrada")
                    .build();
        }
        artifact.setName(datos.getName());
        artifact.setDescription(datos.getDescription());
        artifact.setImageUrl(datos.getImageUrl());
        artifact.setCreatedAt(datos.getCreatedAt());
        artifact.setAcquiredAt(datos.getAcquiredAt());
        artifact.setConditionPercentage(datos.getConditionPercentage());

        if (datos.getCategory() != null && datos.getCategory().getId() != null) {
            Category category = categoryRepository.findById(datos.getCategory().getId());
            if (category != null)
                artifact.setCategory(category);
        }
        if (datos.getExhibitionRoom() != null && datos.getExhibitionRoom().getId() != null) {
            ExhibitionRoom room = roomRepository.findById(datos.getExhibitionRoom().getId());
            if (room != null)
                artifact.setExhibitionRoom(room);
        }
        if (datos.getArtist() != null && datos.getArtist().getId() != null) {
            Artist artist = artistRepository.findById(datos.getArtist().getId());
            if (artist != null)
                artifact.setArtist(artist);
        }
        return Response.ok(artifact).build();
    }

    // ── ELIMINAR ──────────────────────────────────────────────
    @DELETE
    @Path("/{id}")
    @Transactional
    public Response delete(@PathParam("id") Long id) {
        Artifact artifact = artifactRepository.findById(id);
        if (artifact == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Obra con id " + id + " no encontrada")
                    .build();
        }
        artifactRepository.delete(artifact);
        return Response.noContent().build();
    }
}
