package museo.model;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "recorrido_sala")
public class TourRoom {

    @EmbeddedId
    private TourRoomId id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "visita_id")
    private Tour tour;

    @ManyToOne(optional = false)
    @JoinColumn(name = "sala_exposicion_id")
    private ExhibitionRoom exhibitionRoom;

    @Column(name = "orden", nullable = false)
    private Integer sequenceNumber;

    public TourRoom() {
    }

    public TourRoom(TourRoomId id, Tour tour, ExhibitionRoom exhibitionRoom, Integer sequenceNumber) {
        this.id = id;
        this.tour = tour;
        this.exhibitionRoom = exhibitionRoom;
        this.sequenceNumber = sequenceNumber;
    }

    public TourRoomId getId() {
        return id;
    }

    public void setId(TourRoomId id) {
        this.id = id;
    }

    public Tour getTour() {
        return tour;
    }

    public void setTour(Tour tour) {
        this.tour = tour;
    }

    public ExhibitionRoom getExhibitionRoom() {
        return exhibitionRoom;
    }

    public void setExhibitionRoom(ExhibitionRoom exhibitionRoom) {
        this.exhibitionRoom = exhibitionRoom;
    }

    public Integer getSequenceNumber() {
        return sequenceNumber;
    }

    public void setSequenceNumber(Integer sequenceNumber) {
        this.sequenceNumber = sequenceNumber;
    }

   
    @Embeddable
    public static class TourRoomId implements Serializable {

        private Long tourId;
        private Long exhibitionRoomId;

        public TourRoomId() {
        }

        public TourRoomId(Long tourId, Long exhibitionRoomId) {
            this.tourId = tourId;
            this.exhibitionRoomId = exhibitionRoomId;
        }

        public Long getTourId() {
            return tourId;
        }

        public void setTourId(Long tourId) {
            this.tourId = tourId;
        }

        public Long getExhibitionRoomId() {
            return exhibitionRoomId;
        }

        public void setExhibitionRoomId(Long exhibitionRoomId) {
            this.exhibitionRoomId = exhibitionRoomId;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof TourRoomId)) return false;
            TourRoomId other = (TourRoomId) o;
            return Objects.equals(tourId, other.tourId)
                    && Objects.equals(exhibitionRoomId, other.exhibitionRoomId);
        }

        @Override
        public int hashCode() {
            return Objects.hash(tourId, exhibitionRoomId);
        }
    }

}