// 2025/26 Premier League expected starting XIs, keyed by API-Sports team ID

export interface KnownPlayer {
  name: string
  surname: string
  number: number
  position: 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Attacker'
  photo: string // https://media.api-sports.io/football/players/{id}.png — "" if id unknown
}

export interface KnownLineup {
  formation: string
  startXI: KnownPlayer[] // exactly 11 players, GK first, in formation order
}

// Helper to build photo URL; pass 0 if ID unknown
function p(id: number): string {
  return id > 0 ? `https://media.api-sports.io/football/players/${id}.png` : ''
}

const LINEUPS: Record<number, KnownLineup> = {
  // Liverpool (40) — 4-2-3-1 (2025/26: Wirtz + Frimpong replace Salah + Trent)
  40: {
    formation: '4-2-3-1',
    startXI: [
      { name: 'Alisson',    surname: 'Becker',       number: 1,  position: 'Goalkeeper', photo: p(274) },
      { name: 'Jeremie',    surname: 'Frimpong',     number: 2,  position: 'Defender',   photo: p(0) },
      { name: 'Ibrahima',   surname: 'Konaté',       number: 5,  position: 'Defender',   photo: p(38831) },
      { name: 'Virgil',     surname: 'Van Dijk',     number: 4,  position: 'Defender',   photo: p(280) },
      { name: 'Andrew',     surname: 'Robertson',    number: 26, position: 'Defender',   photo: p(790) },
      { name: 'Alexis',     surname: 'Mac Allister', number: 10, position: 'Midfielder', photo: p(48062) },
      { name: 'Ryan',       surname: 'Gravenberch',  number: 38, position: 'Midfielder', photo: p(200671) },
      { name: 'Florian',    surname: 'Wirtz',        number: 11, position: 'Attacker',   photo: p(0) },
      { name: 'Dominik',    surname: 'Szoboszlai',   number: 8,  position: 'Midfielder', photo: p(226484) },
      { name: 'Luis',       surname: 'Diaz',         number: 7,  position: 'Attacker',   photo: p(171923) },
      { name: 'Darwin',     surname: 'Nunez',        number: 9,  position: 'Attacker',   photo: p(168524) },
    ],
  },

  // Arsenal (42) — 4-3-3 (2025/26: Gyokeres replaces Havertz as CF)
  42: {
    formation: '4-3-3',
    startXI: [
      { name: 'David',    surname: 'Raya',        number: 22, position: 'Goalkeeper', photo: p(39115) },
      { name: 'Ben',      surname: 'White',       number: 4,  position: 'Defender',   photo: p(1485) },
      { name: 'William',  surname: 'Saliba',      number: 12, position: 'Defender',   photo: p(280011) },
      { name: 'Gabriel',  surname: 'Magalhães',   number: 6,  position: 'Defender',   photo: p(49156) },
      { name: 'Jurrien',  surname: 'Timber',      number: 24, position: 'Defender',   photo: p(178054) },
      { name: 'Thomas',   surname: 'Partey',      number: 5,  position: 'Midfielder', photo: p(18096) },
      { name: 'Declan',   surname: 'Rice',        number: 41, position: 'Midfielder', photo: p(8942) },
      { name: 'Martin',   surname: 'Ødegaard',    number: 8,  position: 'Midfielder', photo: p(47050) },
      { name: 'Bukayo',   surname: 'Saka',        number: 7,  position: 'Attacker',   photo: p(184240) },
      { name: 'Viktor',   surname: 'Gyökeres',    number: 9,  position: 'Attacker',   photo: p(0) },
      { name: 'Gabriel',  surname: 'Martinelli',  number: 11, position: 'Attacker',   photo: p(397947) },
    ],
  },

  // Man City (50) — 4-3-3
  50: {
    formation: '4-3-3',
    startXI: [
      { name: 'Ederson',           surname: 'Moraes',           number: 31, position: 'Goalkeeper', photo: p(37139) },
      { name: 'Kyle',              surname: 'Walker',           number: 2,  position: 'Defender',   photo: p(627) },
      { name: 'Rúben',             surname: 'Dias',             number: 3,  position: 'Defender',   photo: p(2295) },
      { name: 'Nathan',            surname: 'Aké',              number: 6,  position: 'Defender',   photo: p(21723) },
      { name: 'Josko',             surname: 'Gvardiol',         number: 24, position: 'Defender',   photo: p(284524) },
      { name: 'Rodri',             surname: 'Hernández',        number: 16, position: 'Midfielder', photo: p(165470) },
      { name: 'Kevin',             surname: 'De Bruyne',        number: 17, position: 'Midfielder', photo: p(627) },
      { name: 'Bernardo',          surname: 'Silva',            number: 20, position: 'Midfielder', photo: p(84542) },
      { name: 'Phil',              surname: 'Foden',            number: 47, position: 'Attacker',   photo: p(200389) },
      { name: 'Jeremy',            surname: 'Doku',             number: 11, position: 'Attacker',   photo: p(204571) },
      { name: 'Erling',            surname: 'Haaland',          number: 9,  position: 'Attacker',   photo: p(1100) },
    ],
  },

  // Chelsea (49) — 4-2-3-1
  49: {
    formation: '4-2-3-1',
    startXI: [
      { name: 'Robert',            surname: 'Sánchez',          number: 1,  position: 'Goalkeeper', photo: p(174528) },
      { name: 'Reece',             surname: 'James',            number: 24, position: 'Defender',   photo: p(87668) },
      { name: 'Levi',              surname: 'Colwill',          number: 26, position: 'Defender',   photo: p(360902) },
      { name: 'Wesley',            surname: 'Fofana',           number: 33, position: 'Defender',   photo: p(156391) },
      { name: 'Marc',              surname: 'Cucurella',        number: 3,  position: 'Defender',   photo: p(148915) },
      { name: 'Moisés',            surname: 'Caicedo',          number: 25, position: 'Midfielder', photo: p(256741) },
      { name: 'Enzo',              surname: 'Fernández',        number: 8,  position: 'Midfielder', photo: p(260985) },
      { name: 'Cole',              surname: 'Palmer',           number: 20, position: 'Attacker',   photo: p(348802) },
      { name: 'Christopher',       surname: 'Nkunku',           number: 18, position: 'Attacker',   photo: p(154320) },
      { name: 'Noni',              surname: 'Madueke',          number: 11, position: 'Attacker',   photo: p(280080) },
      { name: 'Nicolas',           surname: 'Jackson',          number: 15, position: 'Attacker',   photo: p(280126) },
    ],
  },

  // Tottenham (47) — 4-3-3
  47: {
    formation: '4-3-3',
    startXI: [
      { name: 'Guglielmo',         surname: 'Vicario',          number: 13, position: 'Goalkeeper', photo: p(148895) },
      { name: 'Pedro',             surname: 'Porro',            number: 23, position: 'Defender',   photo: p(178053) },
      { name: 'Cristian',          surname: 'Romero',           number: 17, position: 'Defender',   photo: p(77847) },
      { name: 'Micky',             surname: 'Van De Ven',       number: 37, position: 'Defender',   photo: p(348706) },
      { name: 'Destiny',           surname: 'Udogie',           number: 38, position: 'Defender',   photo: p(302682) },
      { name: 'Yves',              surname: 'Bissouma',         number: 29, position: 'Midfielder', photo: p(62316) },
      { name: 'Rodrigo',           surname: 'Bentancur',        number: 30, position: 'Midfielder', photo: p(165993) },
      { name: 'James',             surname: 'Maddison',         number: 10, position: 'Midfielder', photo: p(19194) },
      { name: 'Dejan',             surname: 'Kulusevski',       number: 21, position: 'Attacker',   photo: p(242866) },
      { name: 'Son',               surname: 'Heung-min',        number: 7,  position: 'Attacker',   photo: p(19197) },
      { name: 'Dominic',           surname: 'Solanke',          number: 19, position: 'Attacker',   photo: p(186148) },
    ],
  },

  // Newcastle (34) — 4-3-3
  34: {
    formation: '4-3-3',
    startXI: [
      { name: 'Nick',              surname: 'Pope',             number: 22, position: 'Goalkeeper', photo: p(19672) },
      { name: 'Kieran',            surname: 'Trippier',         number: 2,  position: 'Defender',   photo: p(1485) },
      { name: 'Fabian',            surname: 'Schär',            number: 5,  position: 'Defender',   photo: p(1162) },
      { name: 'Sven',              surname: 'Botman',           number: 4,  position: 'Defender',   photo: p(220655) },
      { name: 'Lewis',             surname: 'Hall',             number: 33, position: 'Defender',   photo: p(349261) },
      { name: 'Sandro',            surname: 'Tonali',           number: 8,  position: 'Midfielder', photo: p(159207) },
      { name: 'Bruno',             surname: 'Guimarães',        number: 39, position: 'Midfielder', photo: p(129278) },
      { name: 'Joelinton',         surname: 'Cassio',           number: 7,  position: 'Midfielder', photo: p(9327) },
      { name: 'Harvey',            surname: 'Barnes',           number: 11, position: 'Attacker',   photo: p(181537) },
      { name: 'Alexander',         surname: 'Isak',             number: 14, position: 'Attacker',   photo: p(154384) },
      { name: 'Anthony',           surname: 'Gordon',           number: 10, position: 'Attacker',   photo: p(232430) },
    ],
  },

  // Aston Villa (66) — 4-2-3-1
  66: {
    formation: '4-2-3-1',
    startXI: [
      { name: 'Emiliano',          surname: 'Martínez',         number: 1,  position: 'Goalkeeper', photo: p(1160) },
      { name: 'Matty',             surname: 'Cash',             number: 2,  position: 'Defender',   photo: p(41367) },
      { name: 'Ezri',              surname: 'Konsa',            number: 5,  position: 'Defender',   photo: p(88162) },
      { name: 'Pau',               surname: 'Torres',           number: 14, position: 'Defender',   photo: p(154376) },
      { name: 'Lucas',             surname: 'Digne',            number: 12, position: 'Defender',   photo: p(18939) },
      { name: 'Youri',             surname: 'Tielemans',        number: 8,  position: 'Midfielder', photo: p(25567) },
      { name: 'Douglas',           surname: 'Luiz',             number: 6,  position: 'Midfielder', photo: p(125162) },
      { name: 'Leon',              surname: 'Bailey',           number: 31, position: 'Attacker',   photo: p(140364) },
      { name: 'John',              surname: 'McGinn',           number: 7,  position: 'Midfielder', photo: p(19518) },
      { name: 'Moussa',            surname: 'Diaby',            number: 19, position: 'Attacker',   photo: p(159032) },
      { name: 'Ollie',             surname: 'Watkins',          number: 11, position: 'Attacker',   photo: p(184339) },
    ],
  },

  // Brighton (51) — 4-2-3-1
  51: {
    formation: '4-2-3-1',
    startXI: [
      { name: 'Mark',              surname: 'Flekken',          number: 1,  position: 'Goalkeeper', photo: p(37035) },
      { name: 'Joël',              surname: 'Veltman',          number: 2,  position: 'Defender',   photo: p(18768) },
      { name: 'Lewis',             surname: 'Dunk',             number: 5,  position: 'Defender',   photo: p(18772) },
      { name: 'Jan Paul',          surname: 'Van Hecke',        number: 29, position: 'Defender',   photo: p(215988) },
      { name: 'Pervis',            surname: 'Estupiñán',        number: 33, position: 'Defender',   photo: p(133491) },
      { name: 'Pascal',            surname: 'Groß',             number: 13, position: 'Midfielder', photo: p(18785) },
      { name: 'Carlos',            surname: 'Baleba',           number: 30, position: 'Midfielder', photo: p(362879) },
      { name: 'Simon',             surname: 'Adingra',          number: 23, position: 'Attacker',   photo: p(303049) },
      { name: 'Georginio',         surname: 'Rutter',           number: 10, position: 'Midfielder', photo: p(230493) },
      { name: 'Kaoru',             surname: 'Mitoma',           number: 22, position: 'Attacker',   photo: p(280008) },
      { name: 'Danny',             surname: 'Welbeck',          number: 18, position: 'Attacker',   photo: p(184) },
    ],
  },

  // West Ham (48) — 4-2-3-1
  48: {
    formation: '4-2-3-1',
    startXI: [
      { name: 'Alphonse',          surname: 'Areola',           number: 23, position: 'Goalkeeper', photo: p(18956) },
      { name: 'Vladimir',          surname: 'Coufal',           number: 5,  position: 'Defender',   photo: p(67455) },
      { name: 'Konstantinos',      surname: 'Mavropanos',       number: 15, position: 'Defender',   photo: p(87831) },
      { name: 'Nayef',             surname: 'Aguerd',           number: 27, position: 'Defender',   photo: p(163618) },
      { name: 'Emerson',           surname: 'Palmieri',         number: 33, position: 'Defender',   photo: p(18857) },
      { name: 'Edson',             surname: 'Álvarez',          number: 19, position: 'Midfielder', photo: p(127014) },
      { name: 'Tomáš',             surname: 'Souček',           number: 28, position: 'Midfielder', photo: p(47495) },
      { name: 'Lucas',             surname: 'Paquetá',          number: 11, position: 'Attacker',   photo: p(125796) },
      { name: 'Mohammed',          surname: 'Kudus',            number: 14, position: 'Attacker',   photo: p(284548) },
      { name: 'Jarrod',            surname: 'Bowen',            number: 20, position: 'Attacker',   photo: p(59694) },
      { name: 'Michail',           surname: 'Antonio',          number: 9,  position: 'Attacker',   photo: p(19026) },
    ],
  },

  // Wolves (39) — 4-3-3
  39: {
    formation: '4-3-3',
    startXI: [
      { name: 'José',              surname: 'Sá',               number: 1,  position: 'Goalkeeper', photo: p(130) },
      { name: 'Nélson',            surname: 'Semedo',           number: 22, position: 'Defender',   photo: p(3671) },
      { name: 'Craig',             surname: 'Dawson',           number: 15, position: 'Defender',   photo: p(1497) },
      { name: 'Toti',              surname: 'Gomes',            number: 24, position: 'Defender',   photo: p(271747) },
      { name: 'Rayan',             surname: 'Aït-Nouri',        number: 3,  position: 'Defender',   photo: p(177703) },
      { name: 'André',             surname: 'Trindade',         number: 6,  position: 'Midfielder', photo: p(302616) },
      { name: 'Mario',             surname: 'Lemina',           number: 5,  position: 'Midfielder', photo: p(2920) },
      { name: 'João',              surname: 'Gomes',            number: 35, position: 'Midfielder', photo: p(256730) },
      { name: 'Pablo',             surname: 'Sarabia',          number: 17, position: 'Attacker',   photo: p(47143) },
      { name: 'Matheus',           surname: 'Cunha',            number: 12, position: 'Attacker',   photo: p(217520) },
      { name: 'Hwang',             surname: 'Hee-Chan',         number: 11, position: 'Attacker',   photo: p(127254) },
    ],
  },

  // Brentford (55) — 4-3-3
  55: {
    formation: '4-3-3',
    startXI: [
      { name: 'Mark',              surname: 'Flekken',          number: 1,  position: 'Goalkeeper', photo: p(37035) },
      { name: 'Mathias',           surname: 'Jørgensen',        number: 2,  position: 'Defender',   photo: p(18821) },
      { name: 'Ben',               surname: 'Mee',              number: 16, position: 'Defender',   photo: p(1463) },
      { name: 'Ethan',             surname: 'Pinnock',          number: 5,  position: 'Defender',   photo: p(137610) },
      { name: 'Rico',              surname: 'Henry',            number: 3,  position: 'Defender',   photo: p(18779) },
      { name: 'Christian',         surname: 'Nørgaard',         number: 6,  position: 'Midfielder', photo: p(56867) },
      { name: 'Mathias',           surname: 'Jensen',           number: 8,  position: 'Midfielder', photo: p(18808) },
      { name: 'Vitaly',            surname: 'Janelt',           number: 30, position: 'Midfielder', photo: p(157167) },
      { name: 'Bryan',             surname: 'Mbeumo',           number: 19, position: 'Attacker',   photo: p(161481) },
      { name: 'Yoane',             surname: 'Wissa',            number: 11, position: 'Attacker',   photo: p(193048) },
      { name: 'Kevin',             surname: 'Schade',           number: 23, position: 'Attacker',   photo: p(271788) },
    ],
  },

  // Fulham (36) — 4-2-3-1
  36: {
    formation: '4-2-3-1',
    startXI: [
      { name: 'Bernd',             surname: 'Leno',             number: 1,  position: 'Goalkeeper', photo: p(1118) },
      { name: 'Kenny',             surname: 'Tete',             number: 2,  position: 'Defender',   photo: p(19023) },
      { name: 'Issa',              surname: 'Diop',             number: 5,  position: 'Defender',   photo: p(88183) },
      { name: 'Tim',               surname: 'Ream',             number: 13, position: 'Defender',   photo: p(5858) },
      { name: 'Antonee',           surname: 'Robinson',         number: 33, position: 'Defender',   photo: p(99494) },
      { name: 'Sasa',              surname: 'Lukic',            number: 8,  position: 'Midfielder', photo: p(98789) },
      { name: 'Sander',            surname: 'Berge',            number: 14, position: 'Midfielder', photo: p(76537) },
      { name: 'Alex',              surname: 'Iwobi',            number: 17, position: 'Attacker',   photo: p(19217) },
      { name: 'Andreas',           surname: 'Pereira',          number: 18, position: 'Midfielder', photo: p(19165) },
      { name: 'Harry',             surname: 'Wilson',           number: 19, position: 'Attacker',   photo: p(100072) },
      { name: 'Rodrigo',           surname: 'Muniz',            number: 9,  position: 'Attacker',   photo: p(233520) },
    ],
  },

  // Crystal Palace (52) — 4-2-3-1
  52: {
    formation: '4-2-3-1',
    startXI: [
      { name: 'Dean',              surname: 'Henderson',        number: 1,  position: 'Goalkeeper', photo: p(19232) },
      { name: 'Joel',              surname: 'Ward',             number: 2,  position: 'Defender',   photo: p(1494) },
      { name: 'Joachim',           surname: 'Andersen',         number: 18, position: 'Defender',   photo: p(103471) },
      { name: 'Marc',              surname: 'Guéhi',            number: 6,  position: 'Defender',   photo: p(187219) },
      { name: 'Tyrick',            surname: 'Mitchell',         number: 3,  position: 'Defender',   photo: p(186018) },
      { name: 'Jefferson',         surname: 'Lerma',            number: 8,  position: 'Midfielder', photo: p(32956) },
      { name: 'Will',              surname: 'Hughes',           number: 14, position: 'Midfielder', photo: p(19187) },
      { name: 'Eberechi',          surname: 'Eze',              number: 10, position: 'Attacker',   photo: p(182153) },
      { name: 'Jeffrey',           surname: 'Schlupp',          number: 15, position: 'Midfielder', photo: p(1515) },
      { name: 'Michael',           surname: 'Olise',            number: 7,  position: 'Attacker',   photo: p(243940) },
      { name: 'Jean-Philippe',     surname: 'Mateta',           number: 14, position: 'Attacker',   photo: p(142948) },
    ],
  },

  // Everton (45) — 4-2-3-1
  45: {
    formation: '4-2-3-1',
    startXI: [
      { name: 'Jordan',            surname: 'Pickford',         number: 1,  position: 'Goalkeeper', photo: p(18974) },
      { name: 'Seamus',            surname: 'Coleman',          number: 23, position: 'Defender',   photo: p(1484) },
      { name: 'James',             surname: 'Tarkowski',        number: 6,  position: 'Defender',   photo: p(19218) },
      { name: 'Jarrad',            surname: 'Branthwaite',      number: 32, position: 'Defender',   photo: p(282625) },
      { name: 'Vitaliy',           surname: 'Mykolenko',        number: 19, position: 'Defender',   photo: p(224460) },
      { name: 'Abdoulaye',         surname: 'Doucouré',         number: 16, position: 'Midfielder', photo: p(12483) },
      { name: 'Idrissa',           surname: 'Gueye',            number: 27, position: 'Midfielder', photo: p(19208) },
      { name: 'Jack',              surname: 'Harrison',         number: 11, position: 'Attacker',   photo: p(75799) },
      { name: 'Dwight',            surname: 'McNeil',           number: 7,  position: 'Attacker',   photo: p(131996) },
      { name: 'Alex',              surname: 'Iwobi',            number: 17, position: 'Attacker',   photo: p(19217) },
      { name: 'Dominic',           surname: 'Calvert-Lewin',    number: 9,  position: 'Attacker',   photo: p(18987) },
    ],
  },

  // Nottm Forest (65) — 4-2-3-1
  65: {
    formation: '4-2-3-1',
    startXI: [
      { name: 'Matt',              surname: 'Turner',           number: 1,  position: 'Goalkeeper', photo: p(133571) },
      { name: 'Ola',               surname: 'Aina',             number: 2,  position: 'Defender',   photo: p(19234) },
      { name: 'Nikola',            surname: 'Milenković',       number: 4,  position: 'Defender',   photo: p(53988) },
      { name: 'Murillo',           surname: 'Santos',           number: 25, position: 'Defender',   photo: p(360943) },
      { name: 'Nuno',              surname: 'Tavares',          number: 14, position: 'Defender',   photo: p(195293) },
      { name: 'Ibrahim',           surname: 'Sangaré',          number: 23, position: 'Midfielder', photo: p(133507) },
      { name: 'Ryan',              surname: 'Yates',            number: 22, position: 'Midfielder', photo: p(138521) },
      { name: 'Anthony',           surname: 'Elanga',           number: 31, position: 'Attacker',   photo: p(253370) },
      { name: 'Morgan',            surname: 'Gibbs-White',      number: 10, position: 'Midfielder', photo: p(182001) },
      { name: 'Callum',            surname: 'Hudson-Odoi',      number: 7,  position: 'Attacker',   photo: p(131528) },
      { name: 'Taiwo',             surname: 'Awoniyi',          number: 9,  position: 'Attacker',   photo: p(131556) },
    ],
  },

  // Bournemouth (35) — 4-2-3-1
  35: {
    formation: '4-2-3-1',
    startXI: [
      { name: 'Neto',              surname: 'Murara',           number: 1,  position: 'Goalkeeper', photo: p(1530) },
      { name: 'Adam',              surname: 'Smith',            number: 15, position: 'Defender',   photo: p(1490) },
      { name: 'Illia',             surname: 'Zabarnyi',         number: 26, position: 'Defender',   photo: p(224461) },
      { name: 'Marcos',            surname: 'Senesi',           number: 5,  position: 'Defender',   photo: p(187244) },
      { name: 'Milos',             surname: 'Kerkez',           number: 3,  position: 'Defender',   photo: p(358131) },
      { name: 'Lewis',             surname: 'Cook',             number: 4,  position: 'Midfielder', photo: p(19215) },
      { name: 'Ryan',              surname: 'Christie',         number: 10, position: 'Midfielder', photo: p(19672) },
      { name: 'Antoine',           surname: 'Semenyo',          number: 18, position: 'Attacker',   photo: p(276843) },
      { name: 'Justin',            surname: 'Kluivert',         number: 7,  position: 'Midfielder', photo: p(86614) },
      { name: 'Dango',             surname: 'Ouattara',         number: 11, position: 'Attacker',   photo: p(266830) },
      { name: 'Evanilson',         surname: 'Borges',           number: 9,  position: 'Attacker',   photo: p(247083) },
    ],
  },

  // Southampton (41) — 4-2-3-1 (relegated 2024/25)
  41: {
    formation: '4-2-3-1',
    startXI: [
      { name: 'Alex',              surname: 'McCarthy',         number: 1,  position: 'Goalkeeper', photo: p(1480) },
      { name: 'Kyle',              surname: 'Walker-Peters',    number: 2,  position: 'Defender',   photo: p(131521) },
      { name: 'Taylor',            surname: 'Harwood-Bellis',   number: 5,  position: 'Defender',   photo: p(188832) },
      { name: 'Jan',               surname: 'Bednarek',         number: 35, position: 'Defender',   photo: p(32812) },
      { name: 'Ryan',              surname: 'Manning',          number: 3,  position: 'Defender',   photo: p(99591) },
      { name: 'Lesley',            surname: 'Ugochukwu',        number: 6,  position: 'Midfielder', photo: p(345736) },
      { name: 'Adam',              surname: 'Lallana',          number: 8,  position: 'Midfielder', photo: p(184) },
      { name: 'Tyler',             surname: 'Dibling',          number: 22, position: 'Attacker',   photo: p(0) },
      { name: 'James',             surname: 'Ward-Prowse',      number: 7,  position: 'Midfielder', photo: p(19219) },
      { name: 'Paul',              surname: 'Onuachu',          number: 18, position: 'Attacker',   photo: p(138590) },
      { name: 'Che',               surname: 'Adams',            number: 10, position: 'Attacker',   photo: p(75710) },
    ],
  },

  // Ipswich (57) — 4-2-3-1 (promoted 2024/25)
  57: {
    formation: '4-2-3-1',
    startXI: [
      { name: 'Arijanet',          surname: 'Muric',            number: 1,  position: 'Goalkeeper', photo: p(139580) },
      { name: 'Axel',              surname: 'Tuanzebe',         number: 2,  position: 'Defender',   photo: p(131513) },
      { name: 'Luke',              surname: 'Woolfenden',       number: 6,  position: 'Defender',   photo: p(112133) },
      { name: 'Cameron',           surname: 'Burgess',          number: 5,  position: 'Defender',   photo: p(88202) },
      { name: 'Leif',              surname: 'Davis',            number: 3,  position: 'Defender',   photo: p(191551) },
      { name: 'Sam',               surname: 'Morsy',            number: 8,  position: 'Midfielder', photo: p(18996) },
      { name: 'Massimo',           surname: 'Luongo',           number: 26, position: 'Midfielder', photo: p(18994) },
      { name: 'Wes',               surname: 'Burns',            number: 7,  position: 'Attacker',   photo: p(18993) },
      { name: 'Conor',             surname: 'Chaplin',          number: 14, position: 'Midfielder', photo: p(93437) },
      { name: 'Omari',             surname: 'Hutchinson',       number: 10, position: 'Attacker',   photo: p(274682) },
      { name: 'Liam',              surname: 'Delap',            number: 9,  position: 'Attacker',   photo: p(241008) },
    ],
  },

  // Leicester (46) — 4-2-3-1 (relegated 2024/25)
  46: {
    formation: '4-2-3-1',
    startXI: [
      { name: 'Mads',              surname: 'Hermansen',        number: 1,  position: 'Goalkeeper', photo: p(155768) },
      { name: 'James',             surname: 'Justin',           number: 2,  position: 'Defender',   photo: p(131522) },
      { name: 'Wout',              surname: 'Faes',             number: 33, position: 'Defender',   photo: p(215985) },
      { name: 'Jannik',            surname: 'Vestergaard',      number: 5,  position: 'Defender',   photo: p(50847) },
      { name: 'Victor',            surname: 'Kristiansen',      number: 3,  position: 'Defender',   photo: p(315386) },
      { name: 'Wilfred',           surname: 'Ndidi',            number: 25, position: 'Midfielder', photo: p(19216) },
      { name: 'Harry',             surname: 'Winks',            number: 8,  position: 'Midfielder', photo: p(131527) },
      { name: 'Abdul Fatawu',      surname: 'Issahaku',         number: 29, position: 'Attacker',   photo: p(304617) },
      { name: 'Boubakary',         surname: 'Soumaré',          number: 42, position: 'Midfielder', photo: p(172764) },
      { name: 'Stephy',            surname: 'Mavididi',         number: 20, position: 'Attacker',   photo: p(223553) },
      { name: 'Jamie',             surname: 'Vardy',            number: 9,  position: 'Attacker',   photo: p(1486) },
    ],
  },
}

export function getKnownLineup(teamId: number): KnownLineup | null {
  return LINEUPS[teamId] ?? null
}
