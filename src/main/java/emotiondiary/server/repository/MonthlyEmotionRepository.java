package emotiondiary.server.repository;

import emotiondiary.server.domain.MonthlyEmotion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MonthlyEmotionRepository extends JpaRepository<MonthlyEmotion, Long> {
}
