package emotiondiary.server.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "diary_emotion")
public class DiaryEmotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "diary_id")
    private Diary diary;

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
    public DiaryEmotion(
            final Diary diary,
            final float happiness,
            final float sadness,
            final float anger,
            final float fear,
            final float surprise,
            final float disgust,
            final LocalDateTime createdAt
    ) {
        this.diary = diary;
        this.happiness = happiness;
        this.sadness = sadness;
        this.anger = anger;
        this.fear = fear;
        this.surprise = surprise;
        this.disgust = disgust;
        this.createdAt = LocalDateTime.now();
    }
}
