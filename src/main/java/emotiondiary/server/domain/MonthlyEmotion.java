package emotiondiary.server.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "monthly_emotion")
public class MonthlyEmotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "year")
    private int year;

    @Column(name = "month")
    private int month;

    @Column(name = "happiness")
    private float happiness;

    @Column(name = "sadness")
    private float sadness;

    @Column(name = "anger")
    private float anger;

    @Column(name = "fear")
    private float fear;

    @Column(name = "surprise")
    private float surprise;

    @Column(name = "disgust")
    private float disgust;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Builder
    public MonthlyEmotion(
            final int year,
            final int month,
            final float happiness,
            final float sadness,
            final float anger,
            final float fear,
            final float surprise,
            final float disgust
    ) {
        this.year = year;
        this.month = month;
        this.happiness = happiness;
        this.sadness = sadness;
        this.anger = anger;
        this.fear = fear;
        this.surprise = surprise;
        this.disgust = disgust;
        this.createdAt = LocalDateTime.now();
    }
}
