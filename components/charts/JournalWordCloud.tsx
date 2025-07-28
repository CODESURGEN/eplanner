'use client';

import { Wordcloud } from '@visx/wordcloud';
import { scaleLog } from '@visx/scale';
import { Text } from '@visx/text';

interface WordData {
    text: string;
    value: number;
}

const processText = (text: string): WordData[] => {
    const stopWords = new Set(['a', 'an', 'the', 'in', 'on', 'at', 'for', 'to', 'of', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'but', 'if', 'or', 'and', 'so', 'this', 'that', 'these', 'those', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'what', 'which', 'who', 'whom', 'whose', 'where', 'when', 'why', 'how', 'with', 'by', 'from', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'up', 'down', 'out', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now']);
    const words = text.toLowerCase().match(/\w+/g) || [];
    const wordFrequencies: { [key: string]: number } = {};

    words.forEach(word => {
        if (!stopWords.has(word) && word.length > 2) {
            wordFrequencies[word] = (wordFrequencies[word] || 0) + 1;
        }
    });

    return Object.entries(wordFrequencies).map(([text, value]) => ({ text, value }));
};

const JournalWordCloud = ({ data }: { data: any[] }) => {
    const journalText = data.map(item => item.journal).join(' ');
    const words = processText(journalText);

    const fontScale = scaleLog({
        domain: [Math.min(...words.map(w => w.value)), Math.max(...words.map(w => w.value))],
        range: [10, 100],
    });

    return (
        <Wordcloud
            words={words}
            width={500}
            height={300}
            fontSize={(datum) => fontScale(datum.value)}
            font={'Impact'}
            padding={2}
            spiral={'archimedean'}
            rotate={0}
            random={() => 0.5}
        >
            {(cloudWords) =>
                cloudWords.map((w, i) => (
                    <Text
                        key={w.text}
                        fill={'#8884d8'}
                        textAnchor={'middle'}
                        transform={`translate(${w.x}, ${w.y})`}
                        fontSize={w.size}
                        fontFamily={w.font}
                    >
                        {w.text}
                    </Text>
                ))
            }
        </Wordcloud>
    );
};

export default JournalWordCloud; 