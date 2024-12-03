package emotiondiary.server.util;
import emotiondiary.server.domain.Diary;
import java.util.HashSet;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

@Component
public class DiaryProcessor {

    public String prepareTextForGpt(String text) {
        // 한글 조사의 정규식 (예: 가, 이, 를, 은 등)
        String josaRegex = "\\b[가-힣]+(이|가|를|은|는|에|의|와|과|도|으로|로|에서)\\b";
        Pattern josaPattern = Pattern.compile(josaRegex);
        Matcher matcher = josaPattern.matcher(text);

        // 1. 조사 제거
        String textWithoutJosa = matcher.replaceAll(match -> match.group().substring(0, match.group().length() - 1));

        // 2. 공백 제거
        textWithoutJosa = textWithoutJosa.replaceAll("\\s+", "");

        // 3. 중복 제거
        Set<String> uniqueWords = new HashSet<>();
        String[] words = textWithoutJosa.split("");
        for (String word : words) {
            uniqueWords.add(word);
        }

        // 4. 결과를 다시 문장으로 결합
        StringBuilder resultText = new StringBuilder();
        for (String word : uniqueWords) {
            resultText.append(word).append(" ");
        }

        return resultText.toString().trim();
    }
}
