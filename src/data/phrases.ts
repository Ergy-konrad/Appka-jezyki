export interface Phrase {
  id: string
  language: 'en' | 'es'
  category: string
  phrase: string
  translation: string
  context?: string
}

export interface PhraseCategory {
  id: string
  language: 'en' | 'es'
  name: string
  emoji: string
  description: string
}

export const phraseCategories: PhraseCategory[] = [
  // English
  { id: 'en-questions', language: 'en', name: 'Pytania', emoji: '❓', description: 'Typowe pytania w codziennych sytuacjach' },
  { id: 'en-opinions', language: 'en', name: 'Opinie i zdanie', emoji: '💬', description: 'Wyrażanie opinii, zgoda, sprzeciw' },
  { id: 'en-work-phrases', language: 'en', name: 'W pracy', emoji: '💼', description: 'Spotkania, maile, rozmowy z szefem' },
  { id: 'en-smalltalk', language: 'en', name: 'Small talk', emoji: '🗣️', description: 'Pogawędki, rozmowy towarzyskie' },
  { id: 'en-problems', language: 'en', name: 'Problemy i reklamacje', emoji: '⚠️', description: 'Kiedy coś jest nie tak' },
  { id: 'en-phone', language: 'en', name: 'Przez telefon', emoji: '📞', description: 'Rozmowy telefoniczne' },
  { id: 'en-negations', language: 'en', name: 'Przeczenia', emoji: '🚫', description: 'Jak mówić NIE elegancko' },
  // Spanish
  { id: 'es-survival', language: 'es', name: 'Przetrwanie', emoji: '🆘', description: 'Absolutne minimum na wakacje' },
  { id: 'es-restaurant', language: 'es', name: 'W restauracji', emoji: '🍽️', description: 'Zamawianie, pytania, rachunek' },
  { id: 'es-hotel', language: 'es', name: 'W hotelu', emoji: '🏨', description: 'Zameldowanie, pytania, problemy' },
  { id: 'es-directions', language: 'es', name: 'Pytanie o droge', emoji: '🗺️', description: 'Jak gdzieś trafić' },
  { id: 'es-shopping', language: 'es', name: 'Zakupy', emoji: '🛍️', description: 'W sklepie, na targu' },
  { id: 'es-making-friends', language: 'es', name: 'Poznawanie ludzi', emoji: '🤝', description: 'Jak się przedstawić i zagadać' },
]

export const phrases: Phrase[] = [
  // ═══════════════ ENGLISH B2 ═══════════════

  // ─── Pytania (questions) ───
  { id: 'enp-001', language: 'en', category: 'en-questions', phrase: 'What do you do for a living?', translation: 'Czym się zajmujesz zawodowo?', context: 'Poznawanie kogoś' },
  { id: 'enp-002', language: 'en', category: 'en-questions', phrase: 'How long have you been working here?', translation: 'Jak długo tu pracujesz?', context: 'Praca' },
  { id: 'enp-003', language: 'en', category: 'en-questions', phrase: 'What are you up to this weekend?', translation: 'Co robisz w ten weekend?', context: 'Codzienne' },
  { id: 'enp-004', language: 'en', category: 'en-questions', phrase: 'Could you explain that in more detail?', translation: 'Czy mógłbyś to wyjaśnić bardziej szczegółowo?', context: 'Spotkanie' },
  { id: 'enp-005', language: 'en', category: 'en-questions', phrase: 'Would you mind if I opened the window?', translation: 'Czy miałbyś coś przeciwko, gdybym otworzył okno?', context: 'Grzeczność' },
  { id: 'enp-006', language: 'en', category: 'en-questions', phrase: 'How come you didn\'t come to the party?', translation: 'Czemu nie przyszedłeś na imprezę?', context: 'Nieformalnie' },
  { id: 'enp-007', language: 'en', category: 'en-questions', phrase: 'Do you happen to know where the nearest ATM is?', translation: 'Czy przypadkiem nie wiesz, gdzie jest najbliższy bankomat?', context: 'Uprzejmie' },
  { id: 'enp-008', language: 'en', category: 'en-questions', phrase: 'What\'s the deadline for this project?', translation: 'Jaki jest termin tego projektu?', context: 'Praca' },
  { id: 'enp-009', language: 'en', category: 'en-questions', phrase: 'Have you ever been to Spain?', translation: 'Czy byłeś kiedyś w Hiszpanii?', context: 'Small talk' },
  { id: 'enp-010', language: 'en', category: 'en-questions', phrase: 'What would you recommend?', translation: 'Co byś polecił?', context: 'Restauracja / ogólnie' },

  // ─── Opinie ───
  { id: 'enp-011', language: 'en', category: 'en-opinions', phrase: 'In my opinion, we should wait.', translation: 'Moim zdaniem powinniśmy poczekać.', context: 'Formalnie' },
  { id: 'enp-012', language: 'en', category: 'en-opinions', phrase: 'I totally agree with you.', translation: 'Całkowicie się z tobą zgadzam.' },
  { id: 'enp-013', language: 'en', category: 'en-opinions', phrase: 'I see your point, but I think...', translation: 'Rozumiem twój punkt widzenia, ale myślę że...', context: 'Dyplomatyczny sprzeciw' },
  { id: 'enp-014', language: 'en', category: 'en-opinions', phrase: 'To be honest, I\'m not sure about that.', translation: 'Szczerze mówiąc, nie jestem tego pewien.' },
  { id: 'enp-015', language: 'en', category: 'en-opinions', phrase: 'That\'s a good point.', translation: 'To dobra uwaga.' },
  { id: 'enp-016', language: 'en', category: 'en-opinions', phrase: 'I couldn\'t agree more.', translation: 'Nie mógłbym się bardziej zgodzić. (= totalnie się zgadzam)' },
  { id: 'enp-017', language: 'en', category: 'en-opinions', phrase: 'I\'m not really into that.', translation: 'Nie jestem w to bardzo zajarany. / To nie moja bajka.' },
  { id: 'enp-018', language: 'en', category: 'en-opinions', phrase: 'It depends on the situation.', translation: 'To zależy od sytuacji.' },
  { id: 'enp-019', language: 'en', category: 'en-opinions', phrase: 'As far as I\'m concerned, it\'s fine.', translation: 'Jeśli o mnie chodzi, to jest OK.' },
  { id: 'enp-020', language: 'en', category: 'en-opinions', phrase: 'I\'d rather not, if you don\'t mind.', translation: 'Wolałbym nie, jeśli nie masz nic przeciwko.' },

  // ─── W pracy ───
  { id: 'enp-021', language: 'en', category: 'en-work-phrases', phrase: 'Let me get back to you on that.', translation: 'Wrócę do ciebie w tej sprawie.' },
  { id: 'enp-022', language: 'en', category: 'en-work-phrases', phrase: 'I\'ll keep you posted.', translation: 'Będę cię informować na bieżąco.' },
  { id: 'enp-023', language: 'en', category: 'en-work-phrases', phrase: 'Could we schedule a call for next week?', translation: 'Czy moglibyśmy umówić rozmowę na przyszły tydzień?' },
  { id: 'enp-024', language: 'en', category: 'en-work-phrases', phrase: 'Just to clarify — do you mean...?', translation: 'Tylko żeby wyjaśnić — czy masz na myśli...?' },
  { id: 'enp-025', language: 'en', category: 'en-work-phrases', phrase: 'I\'m afraid I won\'t be able to make it.', translation: 'Obawiam się, że nie dam rady przyjść.', context: 'Odmawianie' },
  { id: 'enp-026', language: 'en', category: 'en-work-phrases', phrase: 'Please find attached the report.', translation: 'W załączniku przesyłam raport.', context: 'Email' },
  { id: 'enp-027', language: 'en', category: 'en-work-phrases', phrase: 'I wanted to follow up on our last conversation.', translation: 'Chciałem nawiązać do naszej ostatniej rozmowy.', context: 'Email' },
  { id: 'enp-028', language: 'en', category: 'en-work-phrases', phrase: 'Shall we move on to the next point?', translation: 'Przejdźmy do następnego punktu?' },
  { id: 'enp-029', language: 'en', category: 'en-work-phrases', phrase: 'I\'ll take care of it.', translation: 'Zajmę się tym.' },
  { id: 'enp-030', language: 'en', category: 'en-work-phrases', phrase: 'Sorry, I didn\'t catch that. Could you repeat?', translation: 'Przepraszam, nie dosłyszałem. Możesz powtórzyć?' },

  // ─── Small talk ───
  { id: 'enp-031', language: 'en', category: 'en-smalltalk', phrase: 'How\'s it going?', translation: 'Jak leci?' },
  { id: 'enp-032', language: 'en', category: 'en-smalltalk', phrase: 'Not bad, can\'t complain.', translation: 'Nieźle, nie narzekam.' },
  { id: 'enp-033', language: 'en', category: 'en-smalltalk', phrase: 'Long time no see! How have you been?', translation: 'Dawno się nie widzieliśmy! Co u ciebie?' },
  { id: 'enp-034', language: 'en', category: 'en-smalltalk', phrase: 'I\'ve been super busy lately.', translation: 'Ostatnio byłem mega zajęty.' },
  { id: 'enp-035', language: 'en', category: 'en-smalltalk', phrase: 'That sounds amazing!', translation: 'To brzmi super!' },
  { id: 'enp-036', language: 'en', category: 'en-smalltalk', phrase: 'Tell me about it!', translation: 'Nie mów! / Wiem co masz na myśli!' },
  { id: 'enp-037', language: 'en', category: 'en-smalltalk', phrase: 'It was nice talking to you.', translation: 'Miło było pogadać.' },
  { id: 'enp-038', language: 'en', category: 'en-smalltalk', phrase: 'Let\'s grab a coffee sometime.', translation: 'Chodźmy kiedyś na kawę.' },

  // ─── Problemy ───
  { id: 'enp-039', language: 'en', category: 'en-problems', phrase: 'I\'d like to make a complaint.', translation: 'Chciałbym złożyć reklamację.' },
  { id: 'enp-040', language: 'en', category: 'en-problems', phrase: 'This isn\'t what I ordered.', translation: 'To nie jest to, co zamówiłem.' },
  { id: 'enp-041', language: 'en', category: 'en-problems', phrase: 'There seems to be a mistake.', translation: 'Wygląda na to, że jest pomyłka.' },
  { id: 'enp-042', language: 'en', category: 'en-problems', phrase: 'Could I speak to the manager, please?', translation: 'Czy mogę rozmawiać z kierownikiem?' },
  { id: 'enp-043', language: 'en', category: 'en-problems', phrase: 'I\'d like a refund, please.', translation: 'Chciałbym zwrot pieniędzy.' },

  // ─── Telefon ───
  { id: 'enp-044', language: 'en', category: 'en-phone', phrase: 'Hi, this is [name] calling from [company].', translation: 'Cześć, tu [imię] z [firma].', context: 'Przedstawienie się' },
  { id: 'enp-045', language: 'en', category: 'en-phone', phrase: 'I\'m calling about...', translation: 'Dzwonię w sprawie...' },
  { id: 'enp-046', language: 'en', category: 'en-phone', phrase: 'Could you put me through to...?', translation: 'Czy mógłbyś mnie połączyć z...?' },
  { id: 'enp-047', language: 'en', category: 'en-phone', phrase: 'I\'ll call you back in five minutes.', translation: 'Oddzwonię za pięć minut.' },
  { id: 'enp-048', language: 'en', category: 'en-phone', phrase: 'Sorry, you\'re breaking up.', translation: 'Przepraszam, słabo cię słyszę. (zrywa połączenie)' },

  // ─── Przeczenia (eleganckie NIE) ───
  { id: 'enp-049', language: 'en', category: 'en-negations', phrase: 'I\'m afraid that\'s not possible.', translation: 'Obawiam się, że to niemożliwe.' },
  { id: 'enp-050', language: 'en', category: 'en-negations', phrase: 'I don\'t think that\'s a good idea.', translation: 'Nie sądzę, żeby to był dobry pomysł.' },
  { id: 'enp-051', language: 'en', category: 'en-negations', phrase: 'I\'d rather not talk about it.', translation: 'Wolałbym o tym nie rozmawiać.' },
  { id: 'enp-052', language: 'en', category: 'en-negations', phrase: 'That\'s not exactly what I meant.', translation: 'To nie do końca to, co miałem na myśli.' },
  { id: 'enp-053', language: 'en', category: 'en-negations', phrase: 'I\'m not convinced that will work.', translation: 'Nie jestem przekonany, że to zadziała.' },
  { id: 'enp-054', language: 'en', category: 'en-negations', phrase: 'Unfortunately, I can\'t make it.', translation: 'Niestety, nie dam rady.' },
  { id: 'enp-055', language: 'en', category: 'en-negations', phrase: 'I have nothing against it, but...', translation: 'Nie mam nic przeciwko, ale...' },

  // ═══════════════ SPANISH A1 ═══════════════

  // ─── Przetrwanie ───
  { id: 'esp-001', language: 'es', category: 'es-survival', phrase: 'No hablo español.', translation: 'Nie mówię po hiszpańsku.' },
  { id: 'esp-002', language: 'es', category: 'es-survival', phrase: '¿Puede hablar más despacio?', translation: 'Czy może Pan mówić wolniej?' },
  { id: 'esp-003', language: 'es', category: 'es-survival', phrase: '¿Puede repetir, por favor?', translation: 'Czy może Pan powtórzyć?' },
  { id: 'esp-004', language: 'es', category: 'es-survival', phrase: '¿Cómo se dice esto en español?', translation: 'Jak to się mówi po hiszpańsku?' },
  { id: 'esp-005', language: 'es', category: 'es-survival', phrase: 'Necesito un médico.', translation: 'Potrzebuję lekarza.' },
  { id: 'esp-006', language: 'es', category: 'es-survival', phrase: '¡Ayuda!', translation: 'Pomocy!' },
  { id: 'esp-007', language: 'es', category: 'es-survival', phrase: 'Soy de Polonia.', translation: 'Jestem z Polski.' },
  { id: 'esp-008', language: 'es', category: 'es-survival', phrase: 'No entiendo. ¿Puede escribirlo?', translation: 'Nie rozumiem. Czy może Pan to napisać?' },

  // ─── Restauracja ───
  { id: 'esp-009', language: 'es', category: 'es-restaurant', phrase: 'Una mesa para dos, por favor.', translation: 'Stolik dla dwóch osób, proszę.' },
  { id: 'esp-010', language: 'es', category: 'es-restaurant', phrase: '¿Qué me recomienda?', translation: 'Co Pan poleca?' },
  { id: 'esp-011', language: 'es', category: 'es-restaurant', phrase: 'Para mí, la paella, por favor.', translation: 'Dla mnie paellę, proszę.' },
  { id: 'esp-012', language: 'es', category: 'es-restaurant', phrase: '¿Tienen algo vegetariano?', translation: 'Czy macie coś wegetariańskiego?' },
  { id: 'esp-013', language: 'es', category: 'es-restaurant', phrase: 'La cuenta, por favor.', translation: 'Rachunek, proszę.' },
  { id: 'esp-014', language: 'es', category: 'es-restaurant', phrase: '¿Está incluida la propina?', translation: 'Czy napiwek jest wliczony?' },
  { id: 'esp-015', language: 'es', category: 'es-restaurant', phrase: 'Estaba todo delicioso, gracias.', translation: 'Wszystko było pyszne, dziękuję.' },
  { id: 'esp-016', language: 'es', category: 'es-restaurant', phrase: 'Soy alérgico a los frutos secos.', translation: 'Jestem uczulony na orzechy.' },

  // ─── Hotel ───
  { id: 'esp-017', language: 'es', category: 'es-hotel', phrase: 'Tengo una reserva a nombre de...', translation: 'Mam rezerwację na nazwisko...' },
  { id: 'esp-018', language: 'es', category: 'es-hotel', phrase: '¿A qué hora es el desayuno?', translation: 'O której jest śniadanie?' },
  { id: 'esp-019', language: 'es', category: 'es-hotel', phrase: '¿Tienen wifi gratuito?', translation: 'Czy macie darmowe wifi?' },
  { id: 'esp-020', language: 'es', category: 'es-hotel', phrase: 'El aire acondicionado no funciona.', translation: 'Klimatyzacja nie działa.' },
  { id: 'esp-021', language: 'es', category: 'es-hotel', phrase: '¿Puede llamar un taxi, por favor?', translation: 'Czy może Pan zamówić taksówkę?' },
  { id: 'esp-022', language: 'es', category: 'es-hotel', phrase: 'Quiero hacer el check-out.', translation: 'Chcę się wymeldować.' },

  // ─── Pytanie o drogę ───
  { id: 'esp-023', language: 'es', category: 'es-directions', phrase: '¿Cómo llego al centro?', translation: 'Jak dojadę do centrum?' },
  { id: 'esp-024', language: 'es', category: 'es-directions', phrase: '¿Está lejos de aquí?', translation: 'Czy to daleko stąd?' },
  { id: 'esp-025', language: 'es', category: 'es-directions', phrase: '¿Se puede ir andando?', translation: 'Czy można dojść pieszo?' },
  { id: 'esp-026', language: 'es', category: 'es-directions', phrase: 'Siga todo recto y gire a la izquierda.', translation: 'Proszę iść prosto i skręcić w lewo.' },
  { id: 'esp-027', language: 'es', category: 'es-directions', phrase: '¿Dónde está la estación de metro?', translation: 'Gdzie jest stacja metra?' },
  { id: 'esp-028', language: 'es', category: 'es-directions', phrase: 'Estoy perdido. ¿Puede ayudarme?', translation: 'Zgubiłem się. Czy może mi Pan pomóc?' },

  // ─── Zakupy ───
  { id: 'esp-029', language: 'es', category: 'es-shopping', phrase: '¿Cuánto cuesta esto?', translation: 'Ile to kosztuje?' },
  { id: 'esp-030', language: 'es', category: 'es-shopping', phrase: '¿Tienen una talla más grande?', translation: 'Czy macie większy rozmiar?' },
  { id: 'esp-031', language: 'es', category: 'es-shopping', phrase: '¿Puedo probármelo?', translation: 'Czy mogę to przymierzyć?' },
  { id: 'esp-032', language: 'es', category: 'es-shopping', phrase: 'Es demasiado caro. ¿Tiene algo más barato?', translation: 'To za drogie. Czy ma Pan coś tańszego?' },
  { id: 'esp-033', language: 'es', category: 'es-shopping', phrase: 'Me lo llevo.', translation: 'Biorę to.' },
  { id: 'esp-034', language: 'es', category: 'es-shopping', phrase: '¿Aceptan tarjeta?', translation: 'Czy akceptujecie kartę?' },

  // ─── Poznawanie ludzi ───
  { id: 'esp-035', language: 'es', category: 'es-making-friends', phrase: '¡Hola! Me llamo... ¿Y tú?', translation: 'Cześć! Nazywam się... A ty?' },
  { id: 'esp-036', language: 'es', category: 'es-making-friends', phrase: '¿De dónde eres?', translation: 'Skąd jesteś?' },
  { id: 'esp-037', language: 'es', category: 'es-making-friends', phrase: 'Estoy aprendiendo español.', translation: 'Uczę się hiszpańskiego.' },
  { id: 'esp-038', language: 'es', category: 'es-making-friends', phrase: '¿Cuántos años tienes?', translation: 'Ile masz lat?' },
  { id: 'esp-039', language: 'es', category: 'es-making-friends', phrase: '¿A qué te dedicas?', translation: 'Czym się zajmujesz?' },
  { id: 'esp-040', language: 'es', category: 'es-making-friends', phrase: '¿Tienes Instagram?', translation: 'Masz Instagrama?' },
  { id: 'esp-041', language: 'es', category: 'es-making-friends', phrase: '¡Nos vemos pronto!', translation: 'Do zobaczenia wkrótce!' },
  { id: 'esp-042', language: 'es', category: 'es-making-friends', phrase: 'Ha sido un placer conocerte.', translation: 'Miło było cię poznać.' },
]

export function getPhrasesByLanguage(lang: 'en' | 'es'): Phrase[] {
  return phrases.filter(p => p.language === lang)
}

export function getPhrasesByCategory(categoryId: string): Phrase[] {
  return phrases.filter(p => p.category === categoryId)
}

export function getPhraseCategoriesByLanguage(lang: 'en' | 'es'): PhraseCategory[] {
  return phraseCategories.filter(c => c.language === lang)
}
