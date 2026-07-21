export interface VocabularyTopic {
  id: string;
  title: string;
  language: "uz" | "ru" | "en";
  wordsCount: number;
  hasTest: boolean;
}

export interface VocabularyWord {
  id: string;
  word: string;
  imageUrl: string; // high-quality visual representation
  audioUrls: {
    uz?: string;
    ru?: string;
    en?: string;
  };
}

export interface VocabularyTestQuestion {
  id: string;
  questionWord: string; // e.g. "Olma" or "Apple"
  options: {
    imageUrl: string; // option illustration card
    label: string;    // label text shown after answering
  }[];
  correctOptionIndex: number;
}

export interface VocabularyTest {
  topicId: string;
  questions: VocabularyTestQuestion[];
}

export const VOCABULARY_TOPICS: VocabularyTopic[] = [
  {
    id: "fruits",
    title: "Mevalar dunyosi",
    language: "uz",
    wordsCount: 3,
    hasTest: true,
  },
  {
    id: "animals",
    title: "Jonivorlar",
    language: "ru",
    wordsCount: 3,
    hasTest: true,
  },
  {
    id: "colors",
    title: "Colors & Shapes",
    language: "en",
    wordsCount: 3,
    hasTest: false, // tests optional check
  },
];

export const VOCABULARY_WORDS: Record<string, VocabularyWord[]> = {
  fruits: [
    {
      id: "fruit-1",
      word: "Olma",
      imageUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=350&auto=format&fit=crop",
      audioUrls: {
        uz: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        en: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      },
    },
    {
      id: "fruit-2",
      word: "Banan",
      imageUrl: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=350&auto=format&fit=crop",
      audioUrls: {
        uz: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      },
    },
    {
      id: "fruit-3",
      word: "Anor",
      imageUrl: "https://images.unsplash.com/photo-1598285514603-518296eb4cba?q=80&w=350&auto=format&fit=crop",
      audioUrls: {
        uz: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      },
    },
  ],
  animals: [
    {
      id: "animal-1",
      word: "Кот",
      imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=350&auto=format&fit=crop",
      audioUrls: {
        ru: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      },
    },
    {
      id: "animal-2",
      word: "Собака",
      imageUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=350&auto=format&fit=crop",
      audioUrls: {
        ru: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
      },
    },
    {
      id: "animal-3",
      word: "Лев",
      imageUrl: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=350&auto=format&fit=crop",
      audioUrls: {
        ru: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
      },
    },
  ],
  colors: [
    {
      id: "color-1",
      word: "Red",
      imageUrl: "https://images.unsplash.com/photo-1520699049698-acd2fccb8cc8?q=80&w=350&auto=format&fit=crop",
      audioUrls: {
        en: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
      },
    },
    {
      id: "color-2",
      word: "Blue",
      imageUrl: "https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?q=80&w=350&auto=format&fit=crop",
      audioUrls: {
        en: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
      },
    },
    {
      id: "color-3",
      word: "Green",
      imageUrl: "https://images.unsplash.com/photo-1533038590840-1cde6b66b730?q=80&w=350&auto=format&fit=crop",
      audioUrls: {
        en: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
      },
    },
  ],
};

export const VOCABULARY_TESTS: Record<string, VocabularyTest> = {
  fruits: {
    topicId: "fruits",
    questions: [
      {
        id: "fruits-q-1",
        questionWord: "Olma",
        options: [
          {
            imageUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=350&auto=format&fit=crop",
            label: "Olma",
          },
          {
            imageUrl: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=350&auto=format&fit=crop",
            label: "Banan",
          },
          {
            imageUrl: "https://images.unsplash.com/photo-1598285514603-518296eb4cba?q=80&w=350&auto=format&fit=crop",
            label: "Anor",
          },
          {
            imageUrl: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?q=80&w=350&auto=format&fit=crop",
            label: "Apelsin",
          },
        ],
        correctOptionIndex: 0,
      },
      {
        id: "fruits-q-2",
        questionWord: "Banan",
        options: [
          {
            imageUrl: "https://images.unsplash.com/photo-1598285514603-518296eb4cba?q=80&w=350&auto=format&fit=crop",
            label: "Anor",
          },
          {
            imageUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=350&auto=format&fit=crop",
            label: "Olma",
          },
          {
            imageUrl: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=350&auto=format&fit=crop",
            label: "Banan",
          },
          {
            imageUrl: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?q=80&w=350&auto=format&fit=crop",
            label: "Apelsin",
          },
        ],
        correctOptionIndex: 2,
      },
    ],
  },
  animals: {
    topicId: "animals",
    questions: [
      {
        id: "animals-q-1",
        questionWord: "Кот",
        options: [
          {
            imageUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=350&auto=format&fit=crop",
            label: "Собака",
          },
          {
            imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=350&auto=format&fit=crop",
            label: "Кот",
          },
          {
            imageUrl: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=350&auto=format&fit=crop",
            label: "Лев",
          },
          {
            imageUrl: "https://images.unsplash.com/photo-1535268647977-a403b69fc756?q=80&w=350&auto=format&fit=crop",
            label: "Панда",
          },
        ],
        correctOptionIndex: 1,
      },
    ],
  },
};
