/**
 * BookVerse Studio — Realistic Demo Reading Content Generator
 * Generates 20 distinct, beautifully formatted, original sample pages across 5 chapters
 * for any published book without using copyrighted material.
 */

export function getSamplePagesForBook(book = {}) {
  const title = book.title || 'The Editorial Sanctuary';
  const author = book.author || 'BookVerse Studio Imprint';
  const genre = book.genre || 'Literature';
  const synopsis = book.synopsis || 'An exploration of timeless narrative craft and human resilience.';

  const chapters = [
    { title: 'Chapter 1: Foundations & Beginnings', startPage: 1 },
    { title: 'Chapter 2: The Architecture of Mindset', startPage: 5 },
    { title: 'Chapter 3: Strategic Execution & Rhythm', startPage: 9 },
    { title: 'Chapter 4: Principles of Resilience', startPage: 13 },
    { title: 'Chapter 5: Epilogue & Timeless Wisdom', startPage: 17 }
  ];

  const totalPages = 20;
  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    let chapterIndex = 0;
    if (i >= 17) chapterIndex = 4;
    else if (i >= 13) chapterIndex = 3;
    else if (i >= 9) chapterIndex = 2;
    else if (i >= 5) chapterIndex = 1;

    const currentChapter = chapters[chapterIndex];

    let paragraphs = [];

    switch (i) {
      case 1:
        paragraphs = [
          `Welcome to the opening pages of "${title}" by ${author}. In the quiet sanctuary of literature, every manuscript serves as a bridge between human experience and enduring truth.`,
          `As we embark upon this journey within the realm of ${genre}, we examine how discipline and vision shape the contours of our personal and collective narratives.`,
          `"To write with conviction," noted the ancient chroniclers, "is to construct a refuge against the fleeting noise of the era." This volume stands dedicated to those who seek depth in an age of distraction.`
        ];
        break;

      case 2:
        paragraphs = [
          `The morning light filtered through the high arched windows of the grand library, illuminating dust motes suspended in the quiet air. Scholar Anand sat at his worn teak writing desk, surrounded by leather-bound codices and yellowed parchments that spanned centuries.`,
          `Outside, the city of Tanjore was gradually awakening to the sounds of temple bells and distant market criers. Yet inside this room, time moved according to a different meter—the deliberate pace of translation and synthesis.`,
          `He turned to a fresh leaf of rag paper, dipped his reed pen into iron gall ink, and began transcribing the ancient commentary on governance and moral philosophy.`
        ];
        break;

      case 3:
        paragraphs = [
          `Great works of literature do not emerge in isolation. They reflect the quiet discipline of their creators and the cultural traditions that nurtured them.`,
          `In analyzing the themes of "${title}", one observes how ${synopsis.slice(0, 120)}... shapes every character interaction and philosophical monologue.`,
          `The rhythm of the prose demands careful reading—a slow savoring of cadence rather than a hurried scan for plot points.`
        ];
        break;

      case 4:
        paragraphs = [
          `By dusk, the first drafting session was complete. Anand stretched his arms and looked over the four completed folio pages. Each letter was inked with precision, honoring the traditions of medieval scribes.`,
          `"Wisdom," he whispered to the empty room, "is not a destination reached overnight, but a habit cultivated through daily devotion to one's craft."`,
          `He carefully bound the pages with silk thread and set them aside to dry before retiring for the evening.`
        ];
        break;

      case 5:
        paragraphs = [
          `Chapter 2 opens with a rigorous investigation into the architecture of mindset. Mindset is the invisible compass that determines how individuals navigate adversity and triumph alike.`,
          `When faced with overwhelming odds, the historical leaders of the Tanjore kingdom relied not solely on martial force, but on strategic foresight and intellectual clarity.`,
          `As ${author} demonstrates, clarity of thought precedes excellence in execution. Without a solid internal foundation, external success remains fleeting.`
        ];
        break;

      case 6:
        paragraphs = [
          `Consider the builder who lays the foundations of a grand temple. Every stone must be chiseled with exactitude, tested against plummet and level, and set in mortar designed to endure centuries.`,
          `So it is with the human intellect. The ideas we absorb, the habits we nurture, and the values we defend construct the inner edifice of our character.`,
          `In this section of "${title}", we trace the gradual assembly of that mental framework.`
        ];
        break;

      case 7:
        paragraphs = [
          `The envoys from the northern provinces arrived under cover of dark, bringing intelligence regarding troop movements along the river delta.`,
          `Inside the council chamber, oil lamps cast long shadows across the polished granite floor. Strategy was debated not with anger or bravado, but with quiet, analytical precision.`,
          `"A victory won by deception is temporary," argued the chief minister. "A victory won by superior organization and moral authority endures for generations."`
        ];
        break;

      case 8:
        paragraphs = [
          `As midnight approached, the council reached a unanimous decision. Orders were dispatched to the fortress commanders, and the envoys were escorted to rest.`,
          `Anand, observing from the gallery, recorded every word in the official court journal. He recognized that history was being shaped in that very room.`,
          `The principles established that night would serve as a template for governance for decades to come.`
        ];
        break;

      case 9:
        paragraphs = [
          `Moving into Chapter 3, our focus shifts toward strategic execution and mastering the natural rhythm of accomplishment.`,
          `Vision without execution is mere daydreaming. True mastery requires translating lofty ideals into repeatable, disciplined daily routines.`,
          `In "${title}", ${author} offers a compelling narrative framework that balances strategic foresight with tactical execution.`
        ];
        break;

      case 10:
        paragraphs = [
          `The rhythm of seasons dictates the agricultural harvest; so too does rhythm govern creative and scholarly production.`,
          `By establishing regular hours of focused effort, free from digital interruption and superficial noise, one creates the mental space necessary for deep work.`,
          `The scribes of antiquity understood this deeply. They structured their days around optimal lighting, quiet periods, and deliberate reflection.`
        ];
        break;

      case 11:
        paragraphs = [
          `Rain began to fall steadily over the citadel, drumming a soothing rhythm against the terracotta roof tiles.`,
          `Anand continued his work by candlelight, his hand moving steadily across the page. The complex legal agreements were being codified into clear, unambiguous prose.`,
          `Every clause was reviewed three times to ensure fairness to both the agrarian guilds and the royal treasury.`
        ];
        break;

      case 12:
        paragraphs = [
          `Precision in language reflects precision in thought. When agreements are drafted with clarity, conflict is minimized and trust flourishes.`,
          `This chapter illustrates how clear communication forms the bedrock of enduring institutions and thriving communities.`,
          `As Anand blotted the final line, he felt a deep sense of satisfaction in a day spent in meaningful labor.`
        ];
        break;

      case 13:
        paragraphs = [
          `Chapter 4 explores the fundamental principles of resilience—the capacity to withstand trial, adapt to change, and emerge stronger.`,
          `No institution or individual escapes adversity. The true test of character lies not in avoiding hardship, but in how one responds when circumstances falter.`,
          `Through the narrative of "${title}", we witness characters tested by betrayal, scarcity, and political upheaval.`
        ];
        break;

      case 14:
        paragraphs = [
          `Resilience is not passive endurance; it is an active, adaptive stance toward life's inevitable challenges.`,
          `Like tempered steel that gains strength through heating and quenching, human character is refined in the crucible of difficulty.`,
          `The lessons drawn from this chapter provide actionable insight for modern readers navigating uncertain times.`
        ];
        break;

      case 15:
        paragraphs = [
          `The drought had tested the kingdom's reserves for three consecutive seasons. Yet because the granaries had been systematically managed, no citizen went hungry.`,
          `Foresight in times of abundance prepares a community to weather times of scarcity with dignity and composure.`,
          `Anand recorded these events with gratitude, noting how wise policy protected the most vulnerable members of society.`
        ];
        break;

      case 16:
        paragraphs = [
          `As the rains finally returned, swelling the dry riverbeds into rushing waterways, a collective relief swept across the land.`,
          `The resilience of the kingdom was celebrated not with ostentatious festivals, but with solemn thanksgiving and renewed dedication to conservation.`,
          `Character, once tested and proven, becomes an indelible part of a culture's living memory.`
        ];
        break;

      case 17:
        paragraphs = [
          `In Chapter 5, we draw near the epilogue and synthesize the timeless wisdom woven throughout "${title}".`,
          `Literature remains our most enduring technology for transmitting human wisdom across centuries and continents.`,
          `As ${author} eloquently demonstrates, the core questions of human existence remain remarkably constant across ages.`
        ];
        break;

      case 18:
        paragraphs = [
          `What constitutes a life well-lived? It is found in devotion to craft, integrity in relationships, and contribution to the common good.`,
          `The stories we tell ourselves and each other shape our aspirations, our ethics, and our legacy.`,
          `In reading this volume, you have participated in an unbroken conversation that spans generations of thinkers and creators.`
        ];
        break;

      case 19:
        paragraphs = [
          `Anand closed the heavy leather binding of the completed manuscript. The work of three years was finally complete, preserved for future scholars and seekers.`,
          `He walked out onto the balcony as the morning sun rose over the temple gopurams, painting the sky in shades of gold and crimson.`,
          `"The word remains," he murmured softly. "Long after the scribe has departed, the truth written in honor endures."`
        ];
        break;

      case 20:
        paragraphs = [
          `Thank you for reading the sample edition of "${title}" by ${author}, brought to you by BookVerse Studio Publishing House.`,
          `This digital sample showcases our commitment to luxury editorial typography, seamless reader navigation, and timeless literary design.`,
          `You have reached Page 20 of 20. Revisit your personal library at any time to re-read or explore additional masterworks.`
        ];
        break;

      default:
        paragraphs = [
          `Sample page ${i} of "${title}".`,
          `Continuing the narrative journey with refined editorial typography and comfortable reading metrics.`
        ];
    }

    pages.push({
      pageNumber: i,
      chapterTitle: currentChapter.title,
      chapterStartPage: currentChapter.startPage,
      paragraphs
    });
  }

  return {
    bookTitle: title,
    authorName: author,
    genreName: genre,
    totalPages,
    chapters,
    pages
  };
}
