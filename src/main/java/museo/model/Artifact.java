package museo.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "obra")
public class Artifact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre", nullable = false, length = 100)
    private String name;

    @Column(name = "descripcion", length = 200)
    private String description;

    @Column(name = "url_imagen", length = 200)
    private String imageUrl;

    @Column(name = "fecha_creacion")
    private LocalDateTime createdAt;

    @Column(name = "fecha_adquisicion")
    private LocalDateTime acquiredAt;

    @Column(name = "porcentaje_conservacion")
    private Integer conditionPercentage;

    @ManyToOne(optional = false)
    @JoinColumn(name = "categoria_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "artista_id")
    private Artist artist;

    @ManyToOne(optional = false)
    @JoinColumn(name = "sala_exposicion_id")
    private ExhibitionRoom exhibitionRoom;

    public Artifact() {
    }

    public Artifact(Long id, String name, String description, String imageUrl, LocalDateTime createdAt,
            LocalDateTime acquiredAt, Integer conditionPercentage, Category category, Artist artist,
            ExhibitionRoom exhibitionRoom) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.createdAt = createdAt;
        this.acquiredAt = acquiredAt;
        this.conditionPercentage = conditionPercentage;
        this.category = category;
        this.artist = artist;
        this.exhibitionRoom = exhibitionRoom;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getAcquiredAt() {
        return acquiredAt;
    }

    public void setAcquiredAt(LocalDateTime acquiredAt) {
        this.acquiredAt = acquiredAt;
    }

    public Integer getConditionPercentage() {
        return conditionPercentage;
    }

    public void setConditionPercentage(Integer conditionPercentage) {
        if (conditionPercentage != null && (conditionPercentage < 0 || conditionPercentage > 100)) {
            throw new IllegalArgumentException("El porcentaje de conservación debe estar entre 0 y 100");
        }
        this.conditionPercentage = conditionPercentage;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Artist getArtist() {
        return artist;
    }

    public void setArtist(Artist artist) {
        this.artist = artist;
    }

    public ExhibitionRoom getExhibitionRoom() {
        return exhibitionRoom;
    }

    public void setExhibitionRoom(ExhibitionRoom exhibitionRoom) {
        this.exhibitionRoom = exhibitionRoom;
    }

}

    

