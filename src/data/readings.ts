export interface ReadingArticle {
  id: string
  language: 'en' | 'es'
  level: string
  title: string
  titlePl: string
  emoji: string
  category: string
  readingTime: number // minutes
  paragraphs: { text: string; translationPl: string }[]
  vocabulary: { word: string; translation: string }[]
  questions: { question: string; questionPl: string; answer: string }[]
}

export const readings: ReadingArticle[] = [
  // ─── English B2 ───
  {
    id: 'read-en-01',
    language: 'en',
    level: 'B2',
    title: 'Remote Work: The Future of Employment',
    titlePl: 'Praca zdalna: przyszłość zatrudnienia',
    emoji: '💻',
    category: 'Business',
    readingTime: 3,
    paragraphs: [
      {
        text: 'The COVID-19 pandemic fundamentally changed the way we work. Millions of employees around the world were forced to work from home, and many discovered that they were just as productive — if not more so — outside the traditional office environment.',
        translationPl: 'Pandemia COVID-19 fundamentalnie zmieniła sposób, w jaki pracujemy. Miliony pracowników na całym świecie zostały zmuszone do pracy z domu i wielu odkryło, że są równie produktywni — jeśli nie bardziej — poza tradycyjnym środowiskiem biurowym.',
      },
      {
        text: 'Companies like Google and Microsoft now offer hybrid work models, allowing employees to split their time between the office and home. However, not everyone is convinced. Some managers argue that remote work leads to weaker team cohesion and makes it harder to mentor junior employees.',
        translationPl: 'Firmy takie jak Google i Microsoft oferują teraz hybrydowe modele pracy, pozwalając pracownikom dzielić czas między biuro a dom. Jednak nie wszyscy są przekonani. Niektórzy menedżerowie twierdzą, że praca zdalna prowadzi do słabszej spójności zespołu i utrudnia mentoring młodszych pracowników.',
      },
      {
        text: 'On the other hand, studies show that remote workers report higher job satisfaction and better work-life balance. They save time and money on commuting, and many appreciate the flexibility to manage their own schedules. The key challenge for companies is finding the right balance between flexibility and collaboration.',
        translationPl: 'Z drugiej strony, badania pokazują, że pracownicy zdalni zgłaszają wyższe zadowolenie z pracy i lepszą równowagę między życiem zawodowym a prywatnym. Oszczędzają czas i pieniądze na dojazdach, a wielu ceni sobie elastyczność w zarządzaniu własnym harmonogramem. Kluczowym wyzwaniem dla firm jest znalezienie właściwej równowagi między elastycznością a współpracą.',
      },
    ],
    vocabulary: [
      { word: 'fundamentally', translation: 'fundamentalnie' },
      { word: 'productive', translation: 'produktywny' },
      { word: 'hybrid', translation: 'hybrydowy' },
      { word: 'cohesion', translation: 'spójność' },
      { word: 'to mentor', translation: 'mentorować' },
      { word: 'work-life balance', translation: 'równowaga praca-życie' },
      { word: 'commuting', translation: 'dojazdy' },
      { word: 'flexibility', translation: 'elastyczność' },
    ],
    questions: [
      { question: 'What did many employees discover during the pandemic?', questionPl: 'Co odkryło wielu pracowników podczas pandemii?', answer: 'They discovered they were just as productive working from home.' },
      { question: 'What is a hybrid work model?', questionPl: 'Czym jest hybrydowy model pracy?', answer: 'Splitting time between office and home.' },
      { question: 'What are two benefits of remote work mentioned in the text?', questionPl: 'Jakie dwie korzyści pracy zdalnej wymieniono w tekście?', answer: 'Higher job satisfaction and better work-life balance.' },
    ],
  },
  {
    id: 'read-en-02',
    language: 'en',
    level: 'B2',
    title: 'The Psychology of Learning a New Language',
    titlePl: 'Psychologia nauki nowego języka',
    emoji: '🧠',
    category: 'Education',
    readingTime: 4,
    paragraphs: [
      {
        text: 'Learning a new language is one of the most rewarding challenges you can take on. Research shows that bilingual people have better memory, improved problem-solving skills, and even delay the onset of dementia by several years.',
        translationPl: 'Nauka nowego języka jest jednym z najbardziej satysfakcjonujących wyzwań. Badania pokazują, że osoby dwujęzyczne mają lepszą pamięć, lepsze umiejętności rozwiązywania problemów, a nawet opóźniają początek demencji o kilka lat.',
      },
      {
        text: 'The most effective language learners share several habits. First, they practice consistently — even just 15 minutes a day is better than three hours once a week. Second, they embrace mistakes as part of the learning process. Third, they immerse themselves in the language through music, films, podcasts, and conversations with native speakers.',
        translationPl: 'Najskuteczniejsi uczniowie języków dzielą kilka nawyków. Po pierwsze, ćwiczą regularnie — nawet 15 minut dziennie jest lepsze niż trzy godziny raz w tygodniu. Po drugie, traktują błędy jako część procesu nauki. Po trzecie, zanurzają się w języku przez muzykę, filmy, podcasty i rozmowy z native speakerami.',
      },
      {
        text: 'Scientists have identified a phenomenon called "the forgetting curve" — without review, we forget 70% of new information within 24 hours. This is why spaced repetition systems (like the one in this app!) are so powerful. They show you words just before you would forget them, making your study time incredibly efficient.',
        translationPl: 'Naukowcy zidentyfikowali zjawisko zwane „krzywą zapominania" — bez powtórek zapominamy 70% nowych informacji w ciągu 24 godzin. Dlatego systemy powtórek rozłożonych w czasie (takie jak w tej aplikacji!) są tak skuteczne. Pokazują ci słowa tuż przed tym, jak byś je zapomniał, czyniąc naukę niesamowicie efektywną.',
      },
      {
        text: 'The key takeaway? Be patient with yourself. Language acquisition is a marathon, not a sprint. Celebrate small wins — understanding a song lyric, ordering food in a restaurant, or having a basic conversation. Every step forward counts.',
        translationPl: 'Kluczowy wniosek? Bądź cierpliwy wobec siebie. Nauka języka to maraton, nie sprint. Świętuj małe zwycięstwa — zrozumienie tekstu piosenki, zamówienie jedzenia w restauracji czy przeprowadzenie podstawowej rozmowy. Każdy krok do przodu się liczy.',
      },
    ],
    vocabulary: [
      { word: 'rewarding', translation: 'satysfakcjonujący' },
      { word: 'bilingual', translation: 'dwujęzyczny' },
      { word: 'onset', translation: 'początek / wystąpienie' },
      { word: 'consistently', translation: 'regularnie / konsekwentnie' },
      { word: 'to embrace', translation: 'zaakceptować / przyjąć' },
      { word: 'to immerse', translation: 'zanurzyć się' },
      { word: 'forgetting curve', translation: 'krzywa zapominania' },
      { word: 'acquisition', translation: 'przyswajanie / nabywanie' },
    ],
    questions: [
      { question: 'How much information do we forget without review within 24 hours?', questionPl: 'Ile informacji zapominamy bez powtórek w ciągu 24h?', answer: '70%' },
      { question: 'What three habits do effective language learners share?', questionPl: 'Jakie trzy nawyki mają skuteczni uczniowie języków?', answer: 'Consistent practice, embracing mistakes, and immersion.' },
      { question: 'Is language learning more like a sprint or a marathon?', questionPl: 'Nauka języka to sprint czy maraton?', answer: 'A marathon.' },
    ],
  },
  {
    id: 'read-en-03',
    language: 'en',
    level: 'B2',
    title: 'Renewable Energy: Poland\'s Green Transition',
    titlePl: 'Energia odnawialna: zielona transformacja Polski',
    emoji: '⚡',
    category: 'OZE / Energy',
    readingTime: 3,
    paragraphs: [
      {
        text: 'Poland has traditionally relied heavily on coal for its energy production, but the landscape is changing rapidly. In recent years, the country has become one of Europe\'s fastest-growing markets for solar and wind energy. In 2023, renewable sources accounted for over 25% of Poland\'s electricity generation.',
        translationPl: 'Polska tradycyjnie w dużym stopniu polegała na węglu w produkcji energii, ale krajobraz zmienia się szybko. W ostatnich latach kraj stał się jednym z najszybciej rosnących rynków energii słonecznej i wiatrowej w Europie. W 2023 roku źródła odnawialne stanowiły ponad 25% produkcji energii elektrycznej w Polsce.',
      },
      {
        text: 'The growth of photovoltaic installations has been particularly impressive. Poland now has over 1 million prosumer installations — households and businesses that both produce and consume solar energy. Government subsidies and falling panel prices have made solar power accessible to ordinary citizens.',
        translationPl: 'Wzrost instalacji fotowoltaicznych był szczególnie imponujący. Polska ma teraz ponad milion instalacji prosumenckich — gospodarstwa domowe i firmy, które zarówno produkują, jak i konsumują energię słoneczną. Dotacje rządowe i spadające ceny paneli uczyniły energię słoneczną dostępną dla zwykłych obywateli.',
      },
      {
        text: 'Wind energy is also expanding, especially offshore wind farms in the Baltic Sea. These massive projects will provide gigawatts of clean electricity. However, challenges remain: grid modernization, energy storage solutions, and managing the intermittent nature of renewable sources are key issues that engineers and asset managers must address.',
        translationPl: 'Energia wiatrowa również się rozwija, szczególnie morskie farmy wiatrowe na Morzu Bałtyckim. Te ogromne projekty dostarczą gigawaty czystej energii. Jednak wyzwania pozostają: modernizacja sieci, rozwiązania magazynowania energii i zarządzanie przerywaną naturą źródeł odnawialnych to kluczowe kwestie, którymi muszą się zająć inżynierowie i zarządzający aktywami.',
      },
    ],
    vocabulary: [
      { word: 'to rely on', translation: 'polegać na' },
      { word: 'renewable', translation: 'odnawialny' },
      { word: 'photovoltaic', translation: 'fotowoltaiczny' },
      { word: 'prosumer', translation: 'prosument' },
      { word: 'subsidy', translation: 'dotacja / subsydium' },
      { word: 'offshore', translation: 'morski / na morzu' },
      { word: 'intermittent', translation: 'przerywany / nieciągły' },
      { word: 'grid', translation: 'sieć (energetyczna)' },
    ],
    questions: [
      { question: 'What percentage of Poland\'s electricity came from renewables in 2023?', questionPl: 'Jaki procent energii w Polsce pochodził z OZE w 2023?', answer: 'Over 25%.' },
      { question: 'What is a prosumer?', questionPl: 'Czym jest prosument?', answer: 'Someone who both produces and consumes energy.' },
      { question: 'Where are new wind farms being built?', questionPl: 'Gdzie budowane są nowe farmy wiatrowe?', answer: 'In the Baltic Sea (offshore).' },
    ],
  },

  // ─── Spanish A1 ───
  {
    id: 'read-es-01',
    language: 'es',
    level: 'A1',
    title: 'Mi primer día en Barcelona',
    titlePl: 'Mój pierwszy dzień w Barcelonie',
    emoji: '🇪🇸',
    category: 'Travel',
    readingTime: 2,
    paragraphs: [
      {
        text: 'Hoy es mi primer día en Barcelona. Estoy muy contento. El hotel está cerca de la playa y la habitación es grande y bonita. Desde la ventana puedo ver el mar.',
        translationPl: 'Dziś jest mój pierwszy dzień w Barcelonie. Jestem bardzo zadowolony. Hotel jest blisko plaży, a pokój jest duży i ładny. Z okna widzę morze.',
      },
      {
        text: 'Por la mañana voy a un café y pido un café con leche y un croissant. El camarero habla muy rápido, pero entiendo un poco. Digo "gracias" y él sonríe.',
        translationPl: 'Rano idę do kawiarni i zamawiam kawę z mlekiem i croissanta. Kelner mówi bardzo szybko, ale trochę rozumiem. Mówię „dziękuję" i on się uśmiecha.',
      },
      {
        text: 'Después camino por Las Ramblas. Hay mucha gente, tiendas y restaurantes. Compro una postal para mi madre y un mapa de la ciudad. Hace mucho sol y hace calor.',
        translationPl: 'Potem spaceruje po Las Ramblas. Jest dużo ludzi, sklepów i restauracji. Kupuję pocztówkę dla mamy i mapę miasta. Jest bardzo słonecznie i gorąco.',
      },
      {
        text: 'Para la cena, voy a un restaurante pequeño. Pido paella y una cerveza. ¡La paella está deliciosa! Pago con tarjeta y dejo propina. Estoy cansado pero feliz. ¡Me gusta mucho Barcelona!',
        translationPl: 'Na kolację idę do małej restauracji. Zamawiam paellę i piwo. Paella jest pyszna! Płacę kartą i zostawiam napiwek. Jestem zmęczony, ale szczęśliwy. Bardzo mi się podoba Barcelona!',
      },
    ],
    vocabulary: [
      { word: 'contento', translation: 'zadowolony' },
      { word: 'ventana', translation: 'okno' },
      { word: 'mar', translation: 'morze' },
      { word: 'camarero', translation: 'kelner' },
      { word: 'rápido', translation: 'szybko' },
      { word: 'caminar', translation: 'spacerować' },
      { word: 'gente', translation: 'ludzie' },
      { word: 'postal', translation: 'pocztówka' },
    ],
    questions: [
      { question: '¿Dónde está el hotel?', questionPl: 'Gdzie jest hotel?', answer: 'Cerca de la playa.' },
      { question: '¿Qué compra en Las Ramblas?', questionPl: 'Co kupuje na Las Ramblas?', answer: 'Una postal y un mapa.' },
      { question: '¿Qué cena?', questionPl: 'Co je na kolację?', answer: 'Paella y cerveza.' },
    ],
  },
  {
    id: 'read-es-02',
    language: 'es',
    level: 'A1',
    title: 'Mi familia',
    titlePl: 'Moja rodzina',
    emoji: '👨‍👩‍👧‍👦',
    category: 'Family',
    readingTime: 2,
    paragraphs: [
      {
        text: 'Me llamo Carlos y tengo veinticinco años. Vivo en Varsovia con mi novia, María. Ella es española, de Sevilla. Hablamos en español e inglés en casa.',
        translationPl: 'Nazywam się Carlos i mam dwadzieścia pięć lat. Mieszkam w Warszawie z moją dziewczyną, Marią. Ona jest Hiszpanką, z Sewilli. W domu rozmawiamy po hiszpańsku i angielsku.',
      },
      {
        text: 'Mi madre se llama Anna y mi padre se llama Tomek. Ellos viven en Cracovia. Tengo un hermano mayor, Piotr. Él tiene treinta años y trabaja en una empresa de energía renovable.',
        translationPl: 'Moja mama ma na imię Anna, a mój tata Tomek. Mieszkają w Krakowie. Mam starszego brata, Piotra. Ma trzydzieści lat i pracuje w firmie zajmującej się energią odnawialną.',
      },
      {
        text: 'Los fines de semana, María y yo cocinamos juntos. A ella le gusta cocinar paella y tortilla española. A mí me gusta cocinar pierogi. ¡Es una mezcla perfecta de culturas!',
        translationPl: 'W weekendy María i ja gotujemy razem. Ona lubi gotować paellę i tortillę hiszpańską. Ja lubię gotować pierogi. To idealne połączenie kultur!',
      },
    ],
    vocabulary: [
      { word: 'novia', translation: 'dziewczyna (partnerka)' },
      { word: 'mayor', translation: 'starszy' },
      { word: 'empresa', translation: 'firma' },
      { word: 'juntos', translation: 'razem' },
      { word: 'mezcla', translation: 'mieszanka / połączenie' },
      { word: 'fin de semana', translation: 'weekend' },
    ],
    questions: [
      { question: '¿De dónde es María?', questionPl: 'Skąd jest María?', answer: 'De Sevilla, España.' },
      { question: '¿Dónde viven los padres de Carlos?', questionPl: 'Gdzie mieszkają rodzice Carlosa?', answer: 'En Cracovia.' },
      { question: '¿Qué cocina Carlos?', questionPl: 'Co gotuje Carlos?', answer: 'Pierogi.' },
    ],
  },
  {
    id: 'read-es-03',
    language: 'es',
    level: 'A1',
    title: 'Un día normal',
    titlePl: 'Zwykły dzień',
    emoji: '🌅',
    category: 'Daily Life',
    readingTime: 2,
    paragraphs: [
      {
        text: 'Me despierto a las siete de la mañana. Primero, me ducho y después desayuno. Normalmente como pan con queso y bebo café con leche.',
        translationPl: 'Budzę się o siódmej rano. Najpierw biorę prysznic, a potem jem śniadanie. Normalnie jem chleb z serem i piję kawę z mlekiem.',
      },
      {
        text: 'Voy al trabajo en metro. El viaje dura treinta minutos. En el metro, escucho un podcast en español o estudio vocabulario en mi teléfono.',
        translationPl: 'Jadę do pracy metrem. Podróż trwa trzydzieści minut. W metrze słucham podcastu po hiszpańsku albo uczę się słówek na telefonie.',
      },
      {
        text: 'Trabajo de nueve a cinco. A las dos como en la cafetería con mis compañeros de trabajo. Hablamos de fútbol, del tiempo y a veces de política.',
        translationPl: 'Pracuję od dziewiątej do piątej. O drugiej jem w stołówce z kolegami z pracy. Rozmawiamy o piłce nożnej, pogodzie i czasem o polityce.',
      },
      {
        text: 'Por la noche, después del trabajo, voy al gimnasio o paseo con mi perro en el parque. Luego ceno, veo una serie en Netflix y leo un poco antes de dormir. Me acuesto a las once.',
        translationPl: 'Wieczorem, po pracy, idę na siłownię albo spaceruję z psem w parku. Potem jem kolację, oglądam serial na Netflixie i czytam trochę przed snem. Kładę się spać o jedenastej.',
      },
    ],
    vocabulary: [
      { word: 'despertarse', translation: 'budzić się' },
      { word: 'ducharse', translation: 'brać prysznic' },
      { word: 'durar', translation: 'trwać' },
      { word: 'escuchar', translation: 'słuchać' },
      { word: 'compañeros', translation: 'koledzy' },
      { word: 'pasear', translation: 'spacerować' },
      { word: 'acostarse', translation: 'kłaść się spać' },
    ],
    questions: [
      { question: '¿A qué hora se despierta?', questionPl: 'O której się budzi?', answer: 'A las siete.' },
      { question: '¿Qué hace en el metro?', questionPl: 'Co robi w metrze?', answer: 'Escucha podcasts o estudia vocabulario.' },
      { question: '¿A qué hora se acuesta?', questionPl: 'O której się kładzie spać?', answer: 'A las once.' },
    ],
  },
]

export function getReadingsByLanguage(lang: 'en' | 'es'): ReadingArticle[] {
  return readings.filter(r => r.language === lang)
}

export function getReadingById(id: string): ReadingArticle | undefined {
  return readings.find(r => r.id === id)
}
