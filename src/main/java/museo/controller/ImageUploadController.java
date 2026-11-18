package museo.controller;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.util.Map;
import java.util.UUID;

import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.resteasy.reactive.RestForm;
import org.jboss.resteasy.reactive.multipart.FileUpload;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/uploads")
public class ImageUploadController {

    private static final long MAX_IMAGE_SIZE = 8L * 1024 * 1024;

    @ConfigProperty(name = "museo.upload.directory", defaultValue = "uploads")
    String uploadDirectory;

    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response upload(@RestForm("file") FileUpload file) throws IOException {
        if (file == null || file.size() == 0) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("message", "Selecciona una imagen para subir."))
                    .build();
        }
        if (file.size() > MAX_IMAGE_SIZE) {
            return Response.status(413)
                    .entity(Map.of("message", "La imagen no puede superar los 8 MB."))
                    .build();
        }

        String extension = detectImageExtension(file.uploadedFile());
        if (extension == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("message", "El archivo no es una imagen PNG, JPEG, GIF, BMP o WEBP válida."))
                    .build();
        }

        String fileName = UUID.randomUUID() + extension;
        java.nio.file.Path directory = java.nio.file.Path.of(uploadDirectory).toAbsolutePath().normalize();
        Files.createDirectories(directory);
        Files.copy(file.uploadedFile(), directory.resolve(fileName));
        return Response.status(Response.Status.CREATED)
                .entity(Map.of("url", "/uploads/" + fileName))
                .build();
    }

    @GET
    @Path("/{fileName}")
    public Response getImage(@PathParam("fileName") String fileName) throws IOException {
        if (!fileName.matches("[0-9a-fA-F-]{36}\\.(png|jpg|gif|bmp|webp)")) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        java.nio.file.Path image = java.nio.file.Path.of(uploadDirectory).toAbsolutePath().normalize().resolve(fileName);
        if (!Files.isRegularFile(image)) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        return Response.ok(Files.readAllBytes(image))
                .type(contentType(fileName))
                .header("X-Content-Type-Options", "nosniff")
                .header("Cache-Control", "public, max-age=31536000, immutable")
                .build();
    }

    private String detectImageExtension(java.nio.file.Path file) throws IOException {
        byte[] header;
        try (InputStream input = Files.newInputStream(file)) {
            header = input.readNBytes(12);
        }

        if (header.length >= 8 && matches(header, 0, 0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) {
            return ".png";
        }
        if (header.length >= 3 && matches(header, 0, 0xff, 0xd8, 0xff)) {
            return ".jpg";
        }
        if (header.length >= 6 && (matchesAscii(header, 0, "GIF87a") || matchesAscii(header, 0, "GIF89a"))) {
            return ".gif";
        }
        if (header.length >= 2 && matchesAscii(header, 0, "BM")) {
            return ".bmp";
        }
        if (header.length >= 12 && matchesAscii(header, 0, "RIFF") && matchesAscii(header, 8, "WEBP")) {
            return ".webp";
        }
        return null;
    }

    private boolean matches(byte[] bytes, int offset, int... expected) {
        for (int i = 0; i < expected.length; i++) {
            if ((bytes[offset + i] & 0xff) != expected[i]) {
                return false;
            }
        }
        return true;
    }

    private boolean matchesAscii(byte[] bytes, int offset, String expected) {
        for (int i = 0; i < expected.length(); i++) {
            if (bytes[offset + i] != (byte) expected.charAt(i)) {
                return false;
            }
        }
        return true;
    }

    private String contentType(String fileName) {
        if (fileName.endsWith(".png")) {
            return "image/png";
        }
        if (fileName.endsWith(".jpg")) {
            return "image/jpeg";
        }
        if (fileName.endsWith(".gif")) {
            return "image/gif";
        }
        if (fileName.endsWith(".bmp")) {
            return "image/bmp";
        }
        return "image/webp";
    }
}
