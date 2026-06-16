import { useState, useEffect, useCallback, useRef } from "react";

// ╔══════════════════════════════════════════════════════════════╗
// ║  GLOBAL FOOTBALL SIMULATOR 2026 — PROFESSIONAL EDITION       ║
// ║  Official FIFA squad data (June 4–5, 2026)                   ║
// ║  48 teams · 1,248 players · 26 per team                      ║
// ║  Not affiliated with FIFA or any governing body              ║
// ╚══════════════════════════════════════════════════════════════╝

// ── DESIGN TOKENS ──
const T = {
  bg:"#04101e", card:"#091729", cardHi:"#0d2040", cardHov:"#112550",
  border:"#1a3a5c", borderGlow:"#2563eb33", text:"#e2e8f0", muted:"#64748b",
  green:"#10b981", teal:"#0d9488", blue:"#3b82f6", indigo:"#6366f1",
  purple:"#8b5cf6", gold:"#f59e0b", amber:"#d97706", red:"#ef4444",
  orange:"#f97316", cyan:"#22d3ee",
  gradHdr:"linear-gradient(135deg,#10b981 0%,#22d3ee 35%,#6366f1 70%,#8b5cf6 100%)",
  gradBtnGreen:"linear-gradient(135deg,#059669,#0d9488)",
  gradBtnPurple:"linear-gradient(135deg,#7c3aed,#6366f1)",
  gradBtnBlue:"linear-gradient(135deg,#1d4ed8,#4f46e5)",
  gradChamp:"linear-gradient(160deg,#451a03,#78350f,#92400e)",
  groupQ:"rgba(16,185,129,0.09)", groupT:"rgba(245,158,11,0.07)",
  scoreBg:"#032015", scoreTxt:"#6ee7b7",
};
const POS_COLOR = {GK:"#f59e0b",DF:"#3b82f6",MF:"#10b981",FW:"#ef4444"};
const POS_ICON  = {GK:"🧤",DF:"🛡️",MF:"⚙️",FW:"⚡"};
const POS_LABEL = {GK:"Goalkeeper",DF:"Defender",MF:"Midfielder",FW:"Forward"};
const SQUADS = {
  "Algeria":{
    coach:"Vladimir Petković",conf:"CAF",flag:"🇩🇿",rating:65,
    jersey:["#006233","#FFFFFF"],
    players:[
      {n:"Mastil Melvin",p:"GK"},{n:"Mandi Aissa",p:"DF"},{n:"Abada Achraf",p:"DF"},{n:"Tougai Mohamed Amine",p:"DF"},
      {n:"Belaid Zineddine",p:"DF"},{n:"Zerrouki Ramiz",p:"MF"},{n:"Mahrez Riyad",p:"FW"},{n:"Aouar Houssem",p:"MF"},
      {n:"Gouiri Amine",p:"FW"},{n:"Chaibi Fares",p:"MF"},{n:"Hadj Moussa Anis",p:"FW"},{n:"Benbouali Nadhir",p:"FW"},
      {n:"Hadjam Jaouen",p:"DF"},{n:"Boudaoui Hicham",p:"MF"},{n:"Ait-nouri Rayan",p:"DF"},{n:"Benbot Oussama",p:"GK"},
      {n:"Belghali Rafik",p:"DF"},{n:"Amoura Mohamed",p:"FW"},{n:"Bentaleb Nabil",p:"MF"},{n:"Boulbina Adil",p:"FW"},
      {n:"Bensebaini Ramy",p:"DF"},{n:"Maza Ibrahim",p:"MF"},{n:"Zidane Luca",p:"GK"},{n:"Titraoui Yassine",p:"MF"},
      {n:"Ghedjemis Fares",p:"FW"},{n:"Chergui Samir",p:"DF"}
    ]
  },
  "Argentina":{
    coach:"Lionel Scaloni",conf:"CONMEBOL",flag:"🇦🇷",rating:89,
    jersey:["#75AADB","#FFFFFF"],
    players:[
      {n:"Musso Juan",p:"GK"},{n:"Balerdi Leonardo",p:"DF"},{n:"Tagliafico Nicolas",p:"DF"},{n:"Montiel Gonzalo",p:"DF"},
      {n:"Paredes Leandro",p:"MF"},{n:"Martinez Lisandro",p:"DF"},{n:"De Paul Rodrigo",p:"MF"},{n:"Barco Valentin",p:"MF"},
      {n:"Alvarez Julian",p:"FW"},{n:"Messi Lionel",p:"FW"},{n:"Lo Celso Giovani",p:"MF"},{n:"Rulli Geronimo",p:"GK"},
      {n:"Romero Cristian",p:"DF"},{n:"Palacios Exequiel",p:"MF"},{n:"Gonzalez Nico",p:"MF"},{n:"Almada Thiago",p:"FW"},
      {n:"Simeone Giuliano",p:"FW"},{n:"Paz Nico",p:"FW"},{n:"Otamendi Nicolas",p:"DF"},{n:"Mac Allister Alexis",p:"MF"},
      {n:"Lopez Jose Manuel",p:"FW"},{n:"Martinez Lautaro",p:"FW"},{n:"Martinez Emiliano",p:"GK"},{n:"Fernandez Enzo",p:"MF"},
      {n:"Medina Facundo",p:"DF"},{n:"Molina Nahuel",p:"DF"}
    ]
  },
  "Australia":{
    coach:"Tony Popovic",conf:"AFC",flag:"🇦🇺",rating:68,
    jersey:["#FFCD00","#00843D"],
    players:[
      {n:"Ryan Mathew",p:"GK"},{n:"Degenek Milos",p:"DF"},{n:"Circati Alessandro",p:"DF"},{n:"Italiano Jacob",p:"DF"},
      {n:"Bos Jordan",p:"DF"},{n:"Geria Jason",p:"DF"},{n:"Leckie Mathew",p:"FW"},{n:"Metcalfe Connor",p:"MF"},
      {n:"Toure Mohamed",p:"FW"},{n:"Hrustic Ajdin",p:"FW"},{n:"Mabil Awer",p:"FW"},{n:"Izzo Paul",p:"GK"},
      {n:"Oneill Aiden",p:"MF"},{n:"Devlin Cameron",p:"MF"},{n:"Trewin Kai",p:"DF"},{n:"Behich Aziz",p:"DF"},
      {n:"Irankunda Nestory",p:"FW"},{n:"Beach Patrick",p:"GK"},{n:"Souttar Harry",p:"DF"},{n:"Volpato Cristian",p:"FW"},
      {n:"Burgess Cameron",p:"DF"},{n:"Irvine Jackson",p:"MF"},{n:"Velupillay Nishan",p:"FW"},{n:"Okon-engstler Paul",p:"MF"},
      {n:"Herrington Lucas",p:"DF"},{n:"Yengi Tete",p:"FW"}
    ]
  },
  "Austria":{
    coach:"Ralf Rangnick",conf:"UEFA",flag:"🇦🇹",rating:72,
    jersey:["#ED2939","#FFFFFF"],
    players:[
      {n:"Schlager Alexander",p:"GK"},{n:"Affengruber David",p:"DF"},{n:"Danso Kevin",p:"DF"},{n:"Schlager Xaver",p:"MF"},
      {n:"Posch Stefan",p:"DF"},{n:"Seiwald Nicolas",p:"MF"},{n:"Arnautovic Marko",p:"FW"},{n:"Alaba David",p:"DF"},
      {n:"Sabitzer Marcel",p:"MF"},{n:"Grillitsch Florian",p:"MF"},{n:"Gregoritsch Michael",p:"FW"},{n:"Wiegele Florian",p:"GK"},
      {n:"Pentz Patrick",p:"GK"},{n:"Kalajdzic Sasa",p:"FW"},{n:"Lienhart Philipp",p:"DF"},{n:"Mwene Phillip",p:"DF"},
      {n:"Chukwuemeka Carney",p:"MF"},{n:"Schmid Romano",p:"MF"},{n:"Baumgartner Christoph",p:"MF"},{n:"Laimer Konrad",p:"MF"},
      {n:"Wimmer Patrick",p:"FW"},{n:"Prass Alexander",p:"MF"},{n:"Friedl Marco",p:"DF"},{n:"Wanner Paul",p:"MF"},
      {n:"Svoboda Michael",p:"DF"},{n:"Schoepf Alessandro",p:"MF"}
    ]
  },
  "Belgium":{
    coach:"Rudi Garcia",conf:"UEFA",flag:"🇧🇪",rating:82,
    jersey:["#ED2939","#FDDA24"],
    players:[
      {n:"Courtois Thibaut",p:"GK"},{n:"Debast Zeno",p:"DF"},{n:"Theate Arthur",p:"DF"},{n:"Mechele Brandon",p:"DF"},
      {n:"De Cuyper Maxim",p:"DF"},{n:"Witsel Axel",p:"MF"},{n:"De Bruyne Kevin",p:"MF"},{n:"Tielemans Youri",p:"MF"},
      {n:"Lukaku Romelu",p:"FW"},{n:"Trossard Leandro",p:"FW"},{n:"Doku Jeremy",p:"FW"},{n:"Lammens Senne",p:"GK"},
      {n:"Penders Mike",p:"GK"},{n:"Lukebakio Dodi",p:"FW"},{n:"Meunier Thomas",p:"DF"},{n:"De Winter Koni",p:"DF"},
      {n:"De Ketelaere Charles",p:"FW"},{n:"Seys Joaquin",p:"DF"},{n:"Moreira Diego",p:"MF"},{n:"Vanaken Hans",p:"MF"},
      {n:"Castagne Timothy",p:"DF"},{n:"Saelemaekers Alexis",p:"MF"},{n:"Raskin Nicolas",p:"MF"},{n:"Onana Amadou",p:"MF"},
      {n:"Ngoy Nathan",p:"DF"},{n:"Fernandez-pardo Matias",p:"FW"}
    ]
  },
  "Bosnia & Herzegovina":{
    coach:"Sergej Barbarez",conf:"UEFA",flag:"🇧🇦",rating:66,
    jersey:["#002395","#FCD116"],
    players:[
      {n:"Vasilj Nikola",p:"GK"},{n:"Mujakic Nihad",p:"DF"},{n:"Hadzikadunic Dennis",p:"DF"},{n:"Muharemovic Tarik",p:"DF"},
      {n:"Kolasinac Sead",p:"DF"},{n:"Tahirovic Benjamin",p:"MF"},{n:"Dedic Amar",p:"DF"},{n:"Gigovic Armin",p:"MF"},
      {n:"Bazdar Samed",p:"FW"},{n:"Demirovic Ermedin",p:"FW"},{n:"Dzeko Edin",p:"FW"},{n:"Jurkas Mladen",p:"GK"},
      {n:"Basic Ivan",p:"MF"},{n:"Sunjic Ivan",p:"MF"},{n:"Memic Amar",p:"MF"},{n:"Hadziahmetovic Amir",p:"MF"},
      {n:"Burnic Dzenis",p:"MF"},{n:"Katic Nikola",p:"DF"},{n:"Alajbegovic Kerim",p:"FW"},{n:"Bajraktarevic Esmir",p:"FW"},
      {n:"Radeljic Stjepan",p:"DF"},{n:"Zlomislic Martin",p:"GK"},{n:"Tabakovic Haris",p:"FW"},{n:"Celik Nidal",p:"DF"},
      {n:"Lukic Jovo",p:"FW"},{n:"Mahmic Ermin",p:"MF"}
    ]
  },
  "Brazil":{
    coach:"Carlo Ancelotti",conf:"CONMEBOL",flag:"🇧🇷",rating:88,
    jersey:["#FFDF00","#009739"],
    players:[
      {n:"Alisson",p:"GK"},{n:"Wesley",p:"DF"},{n:"Gabriel Magalhaes",p:"DF"},{n:"Marquinhos",p:"DF"},
      {n:"Casemiro",p:"MF"},{n:"Alex Sandro",p:"DF"},{n:"Vinicius Junior",p:"FW"},{n:"Bruno Guimaraes",p:"MF"},
      {n:"Matheus Cunha",p:"FW"},{n:"Neymar Jr",p:"FW"},{n:"Raphinha",p:"FW"},{n:"Weverton",p:"GK"},
      {n:"Danilo",p:"DF"},{n:"Bremer",p:"DF"},{n:"Leo Pereira",p:"DF"},{n:"Douglas Santos",p:"DF"},
      {n:"Fabinho",p:"MF"},{n:"Danilo Santos",p:"MF"},{n:"Endrick",p:"FW"},{n:"Lucas Paqueta",p:"MF"},
      {n:"Luiz Henrique",p:"FW"},{n:"Gabriel Martinelli",p:"FW"},{n:"Ederson",p:"GK"},{n:"Roger Ibanez",p:"DF"},
      {n:"Igor Thiago",p:"FW"},{n:"Rayan",p:"FW"}
    ]
  },
  "Cabo Verde":{
    coach:"Bubista",conf:"CAF",flag:"🇨🇻",rating:51,
    jersey:["#003893","#CF2027"],
    players:[
      {n:"Vozinha",p:"GK"},{n:"Stopira",p:"DF"},{n:"Diney Borges",p:"DF"},{n:"Pico Lopes",p:"DF"},
      {n:"Logan Costa",p:"DF"},{n:"Kevin Pina",p:"MF"},{n:"Jovane Cabral",p:"MF"},{n:"Joao Paulo",p:"MF"},
      {n:"Gilson Benchimol",p:"FW"},{n:"Jamiro Monteiro",p:"MF"},{n:"Garry Rodrigues",p:"MF"},{n:"Marcio Rosa",p:"GK"},
      {n:"Sidny Lopes Cabral",p:"DF"},{n:"Deroy Duarte",p:"MF"},{n:"Laros Duarte",p:"MF"},{n:"Yannick Semedo",p:"MF"},
      {n:"Willy Semedo",p:"MF"},{n:"Telmo Arcanjo",p:"MF"},{n:"Dailon Livramento",p:"FW"},{n:"Ryan Mendes",p:"FW"},
      {n:"Nuno Da Costa",p:"MF"},{n:"Steven Moreira",p:"DF"},{n:"Cj Dos Santos",p:"GK"},{n:"Wagner Pina",p:"DF"},
      {n:"Kelvin Pires",p:"DF"},{n:"Helio Varela",p:"MF"}
    ]
  },
  "Canada":{
    coach:"Jesse Marsch",conf:"CONCACAF",flag:"🇨🇦",rating:73,
    jersey:["#FF0000","#FFFFFF"],
    players:[
      {n:"St. Clair Dayne",p:"GK"},{n:"Johnston Alistair",p:"DF"},{n:"Jones Alfie",p:"DF"},{n:"De Fougerolles Luc",p:"DF"},
      {n:"Waterman Joel",p:"DF"},{n:"Choiniere Mathieu",p:"MF"},{n:"Eustaquio Stephen",p:"MF"},{n:"Kone Ismael",p:"MF"},
      {n:"Larin Cyle",p:"FW"},{n:"David Jonathan",p:"FW"},{n:"Millar Liam",p:"MF"},{n:"Oluwaseyi Tani",p:"FW"},
      {n:"Cornelius Derek",p:"DF"},{n:"Shaffelburg Jacob",p:"MF"},{n:"Bombito Moise",p:"DF"},{n:"Crepeau Maxime",p:"GK"},
      {n:"Buchanan Tajon",p:"FW"},{n:"Goodman Owen",p:"GK"},{n:"Davies Alphonso",p:"DF"},{n:"Ahmed Ali",p:"FW"},
      {n:"Osorio Jonathan",p:"MF"},{n:"Laryea Richie",p:"DF"},{n:"Sigur Niko",p:"DF"},{n:"David Promise",p:"FW"},
      {n:"Saliba Nathan",p:"MF"},{n:"Flores Marcelo",p:"MF"}
    ]
  },
  "Colombia":{
    coach:"Nestor Lorenzo",conf:"CONMEBOL",flag:"🇨🇴",rating:79,
    jersey:["#FCD116","#003893"],
    players:[
      {n:"Ospina David",p:"GK"},{n:"Munoz Daniel",p:"DF"},{n:"Lucumi Jhon",p:"DF"},{n:"Arias Santiago",p:"DF"},
      {n:"Castano Kevin",p:"MF"},{n:"Rios Richard",p:"MF"},{n:"Diaz Luis",p:"FW"},{n:"Carrascal Jorge",p:"MF"},
      {n:"Cordoba Jhon",p:"FW"},{n:"Rodriguez James",p:"MF"},{n:"Arias Jhon",p:"MF"},{n:"Vargas Camilo",p:"GK"},
      {n:"Mina Yerry",p:"DF"},{n:"Puerta Gustavo",p:"DF"},{n:"Portilla Juan",p:"MF"},{n:"Lerma Jefferson",p:"MF"},
      {n:"Mojica Johan",p:"DF"},{n:"Ditta Willer",p:"DF"},{n:"Hernandez Cucho",p:"FW"},{n:"Quintero Juan",p:"MF"},
      {n:"Campaz Jaminton",p:"FW"},{n:"Machado Deiver",p:"DF"},{n:"Sanchez Davinson",p:"DF"},{n:"Montero Alvaro",p:"GK"},
      {n:"Suarez Luis",p:"FW"},{n:"Gomez Andres",p:"FW"}
    ]
  },
  "Congo DR":{
    coach:"Sebastien Desabre",conf:"CAF",flag:"🇨🇩",rating:57,
    jersey:["#007FFF","#CE1126"],
    players:[
      {n:"Mpasi Lionel",p:"GK"},{n:"Wan-bissaka Aaron",p:"DF"},{n:"Kapuadi Steve",p:"DF"},{n:"Tuanzebe Axel",p:"DF"},
      {n:"Batubinsika Dylan",p:"DF"},{n:"Mukau Ngalayel",p:"MF"},{n:"Mbuku Nathanael",p:"MF"},{n:"Moutoussamy Samuel",p:"MF"},
      {n:"Cipenga Brian",p:"FW"},{n:"Bongonda Theo",p:"MF"},{n:"Kakuta Gael",p:"FW"},{n:"Kayembe Joris",p:"DF"},
      {n:"Elia Meschack",p:"FW"},{n:"Sadiki Noah",p:"MF"},{n:"Tshibola Aaron",p:"MF"},{n:"Fayulu Timothy",p:"GK"},
      {n:"Bakambu Cedric",p:"FW"},{n:"Pickel Charles",p:"MF"},{n:"Mayele Fiston",p:"FW"},{n:"Wissa Yoane",p:"FW"},
      {n:"Epolo Matthieu",p:"GK"},{n:"Mbemba Chancel",p:"DF"},{n:"Banza Simon",p:"FW"},{n:"Kalulu Gedeon",p:"DF"},
      {n:"Kayembe Edo",p:"MF"},{n:"Masuaku Arthur",p:"DF"}
    ]
  },
  "Côte d'Ivoire":{
    coach:"Emerse Faé",conf:"CAF",flag:"🇨🇮",rating:72,
    jersey:["#FF8200","#009A44"],
    players:[
      {n:"Fofana Yahia",p:"GK"},{n:"Diomande Ousmane",p:"DF"},{n:"Konan Ghislain",p:"DF"},{n:"Seri Jean Michael",p:"MF"},
      {n:"Singo Wilfried",p:"DF"},{n:"Fofana Seko",p:"MF"},{n:"Kossounou Odilon",p:"DF"},{n:"Kessie Franck",p:"MF"},
      {n:"Bonny Ange-yoan",p:"FW"},{n:"Adingra Simon",p:"FW"},{n:"Diomande Yan",p:"FW"},{n:"Wahi Elye",p:"FW"},
      {n:"Operi Christopher",p:"DF"},{n:"Diakite Oumar",p:"FW"},{n:"Diallo Amad",p:"FW"},{n:"Kone Mohamed",p:"GK"},
      {n:"Doue Guela",p:"DF"},{n:"Sangare Ibrahim",p:"MF"},{n:"Pepe Nicolas",p:"FW"},{n:"Agbadou Emmanuel",p:"DF"},
      {n:"Ndicka Evan",p:"DF"},{n:"Guessand Evann",p:"FW"},{n:"Lafont Alban",p:"GK"},{n:"Toure Bazoumana",p:"FW"},
      {n:"Guiagon Parfait",p:"MF"},{n:"Oulai Christ Inao",p:"MF"}
    ]
  },
  "Croatia":{
    coach:"Zlatko Dalić",conf:"UEFA",flag:"🇭🇷",rating:78,
    jersey:["#FF0000","#FFFFFF"],
    players:[
      {n:"Livakovic Dominik",p:"GK"},{n:"Stanisic Josip",p:"DF"},{n:"Pongracic Marin",p:"DF"},{n:"Gvardiol Josko",p:"DF"},
      {n:"Caleta-car Duje",p:"DF"},{n:"Sutalo Josip",p:"DF"},{n:"Moro Nikola",p:"MF"},{n:"Kovacic Mateo",p:"MF"},
      {n:"Kramaric Andrej",p:"FW"},{n:"Modric Luka",p:"MF"},{n:"Budimir Ante",p:"FW"},{n:"Pandur Ivor",p:"GK"},
      {n:"Vlasic Nikola",p:"MF"},{n:"Perisic Ivan",p:"FW"},{n:"Pasalic Mario",p:"MF"},{n:"Baturina Martin",p:"MF"},
      {n:"Sucic Petar",p:"MF"},{n:"Jakic Kristijan",p:"DF"},{n:"Fruk Toni",p:"MF"},{n:"Matanovic Igor",p:"FW"},
      {n:"Sucic Luka",p:"MF"},{n:"Vuskovic Luka",p:"DF"},{n:"Kotarski Dominik",p:"GK"},{n:"Pasalic Marco",p:"FW"},
      {n:"Erlic Martin",p:"DF"},{n:"Musa Petar",p:"FW"}
    ]
  },
  "Curaçao":{
    coach:"Dirk Advocaat",conf:"CONCACAF",flag:"🇨🇼",rating:41,
    jersey:["#003DA5","#F9E300"],
    players:[
      {n:"Room Eloy",p:"GK"},{n:"Sambo Shurandy",p:"DF"},{n:"Gaari Jurien",p:"DF"},{n:"Van Eijma Roshon",p:"DF"},
      {n:"Floranus Sherel",p:"DF"},{n:"Roemeratoe Godfried",p:"MF"},{n:"Bacuna Juninho",p:"MF"},{n:"Comenencia Livano",p:"MF"},
      {n:"Locadia Juergen",p:"FW"},{n:"Bacuna Leandro",p:"MF"},{n:"Antonisse Jeremy",p:"FW"},{n:"Hansen Sontje",p:"FW"},
      {n:"Noslin Tyrese",p:"FW"},{n:"Gorre Kenji",p:"FW"},{n:"Martha Arjany",p:"MF"},{n:"Margaritha Jearl",p:"FW"},
      {n:"Kuwas Brandley",p:"FW"},{n:"Obispo Armando",p:"DF"},{n:"Kastaneer Gervane",p:"FW"},{n:"Brenet Joshua",p:"DF"},
      {n:"Chong Tahith",p:"MF"},{n:"Felida Kevin",p:"MF"},{n:"Bazoer Riechedly",p:"DF"},{n:"Fonville Deveron",p:"DF"},
      {n:"Bodak Tyrick",p:"GK"},{n:"Doornbusch Trevor",p:"GK"}
    ]
  },
  "Czechia":{
    coach:"Miroslav Koubek",conf:"UEFA",flag:"🇨🇿",rating:68,
    jersey:["#D7141A","#FFFFFF"],
    players:[
      {n:"Kovar Matej",p:"GK"},{n:"Zima David",p:"DF"},{n:"Holes Tomas",p:"DF"},{n:"Hranac Robin",p:"DF"},
      {n:"Coufal Vladimir",p:"DF"},{n:"Chaloupek Stepan",p:"DF"},{n:"Krejci Ladislav",p:"DF"},{n:"Darida Vladimir",p:"MF"},
      {n:"Hlozek Adam",p:"FW"},{n:"Schick Patrik",p:"FW"},{n:"Kuchta Jan",p:"FW"},{n:"Cerv Lukas",p:"MF"},
      {n:"Chytil Mojmir",p:"FW"},{n:"Jurasek David",p:"DF"},{n:"Sulc Pavel",p:"FW"},{n:"Stanek Jindrich",p:"GK"},
      {n:"Provod Lukas",p:"MF"},{n:"Sadilek Michal",p:"MF"},{n:"Chory Tomas",p:"FW"},{n:"Zeleny Jaroslav",p:"DF"},
      {n:"Doudera David",p:"DF"},{n:"Soucek Tomas",p:"MF"},{n:"Hornicek Lukas",p:"GK"},{n:"Sojka Alexandr",p:"MF"},
      {n:"Sochurek Hugo",p:"MF"},{n:"Visinsky Denis",p:"FW"}
    ]
  },
  "Ecuador":{
    coach:"Sebastián Beccacece",conf:"CONMEBOL",flag:"🇪🇨",rating:73,
    jersey:["#FFD100","#003DA5"],
    players:[
      {n:"Galindez Hernan",p:"GK"},{n:"Torres Felix",p:"DF"},{n:"Hincapie Piero",p:"DF"},{n:"Ordonez Joel",p:"DF"},
      {n:"Alcivar Jordy",p:"MF"},{n:"Pacho Willian",p:"DF"},{n:"Estupinan Pervis",p:"DF"},{n:"Valencia Anthony",p:"MF"},
      {n:"Yeboah John",p:"FW"},{n:"Paez Kendry",p:"MF"},{n:"Rodriguez Kevin",p:"FW"},{n:"Ramirez Moises",p:"GK"},
      {n:"Valencia Enner",p:"FW"},{n:"Minda Alan",p:"MF"},{n:"Vite Pedro",p:"MF"},{n:"Caicedo Jordy",p:"FW"},
      {n:"Preciado Angelo",p:"DF"},{n:"Castillo Denil",p:"MF"},{n:"Plata Gonzalo",p:"FW"},{n:"Angulo Nilson",p:"FW"},
      {n:"Franco Alan",p:"MF"},{n:"Valle Gonzalo",p:"GK"},{n:"Caicedo Moises",p:"MF"},{n:"Arevalo Jeremy",p:"FW"},
      {n:"Porozo Jackson",p:"DF"},{n:"Medina Yaimar",p:"DF"}
    ]
  },
  "Egypt":{
    coach:"Hossam Hassan",conf:"CAF",flag:"🇪🇬",rating:69,
    jersey:["#C8102E","#FFFFFF"],
    players:[
      {n:"Mohamed Elshenawy",p:"GK"},{n:"Yasser Ibrahim",p:"DF"},{n:"Mohamed Hany",p:"DF"},{n:"Hossam Abdelmaguid",p:"DF"},
      {n:"Ramy Rabia",p:"DF"},{n:"Mohamed Abdelmoneim",p:"DF"},{n:"Trezeguet",p:"FW"},{n:"Emam Ashour",p:"MF"},
      {n:"Hamza Abdelkarim",p:"FW"},{n:"Mohamed Salah",p:"FW"},{n:"Mostafa Zico",p:"MF"},{n:"Haissem Hassan",p:"FW"},
      {n:"Ahmed Fatouh",p:"DF"},{n:"Hamdy Fathy",p:"MF"},{n:"Karim Hafez",p:"DF"},{n:"Mahdy Soliman",p:"GK"},
      {n:"Mohanad Lashin",p:"MF"},{n:"Nabil Donga",p:"MF"},{n:"Marawan Attia",p:"MF"},{n:"Ibrahim Adel",p:"FW"},
      {n:"Mahmoud Saber",p:"MF"},{n:"Omar Marmoush",p:"FW"},{n:"Mostafa Shoubir",p:"GK"},{n:"Tarek Alaa",p:"DF"},
      {n:"Zizo",p:"FW"},{n:"Mohamed Alaa",p:"GK"}
    ]
  },
  "England":{
    coach:"Thomas Tuchel",conf:"UEFA",flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿",rating:86,
    jersey:["#FFFFFF","#002366"],
    players:[
      {n:"Pickford Jordan",p:"GK"},{n:"Konsa Ezri",p:"DF"},{n:"Oreilly Nico",p:"DF"},{n:"Rice Declan",p:"MF"},
      {n:"Stones John",p:"DF"},{n:"Guehi Marc",p:"DF"},{n:"Saka Bukayo",p:"FW"},{n:"Anderson Elliot",p:"MF"},
      {n:"Kane Harry",p:"FW"},{n:"Bellingham Jude",p:"MF"},{n:"Rashford Marcus",p:"FW"},{n:"Livramento Tino",p:"DF"},
      {n:"Henderson Dean",p:"GK"},{n:"Henderson Jordan",p:"MF"},{n:"Burn Dan",p:"DF"},{n:"Mainoo Kobbie",p:"MF"},
      {n:"Rogers Morgan",p:"MF"},{n:"Gordon Anthony",p:"FW"},{n:"Watkins Ollie",p:"FW"},{n:"Madueke Noni",p:"FW"},
      {n:"Eze Eberechi",p:"MF"},{n:"Toney Ivan",p:"FW"},{n:"Trafford James",p:"GK"},{n:"James Reece",p:"DF"},
      {n:"Spence Djed",p:"DF"},{n:"Quansah Jarell",p:"DF"}
    ]
  },
  "France":{
    coach:"Didier Deschamps",conf:"UEFA",flag:"🇫🇷",rating:91,
    jersey:["#002395","#FFFFFF"],
    players:[
      {n:"Samba Brice",p:"GK"},{n:"Gusto Malo",p:"DF"},{n:"Digne Lucas",p:"DF"},{n:"Upamecano Dayot",p:"DF"},
      {n:"Kounde Jules",p:"DF"},{n:"Kone Manu",p:"MF"},{n:"Dembele Ousmane",p:"FW"},{n:"Tchouameni Aurelien",p:"MF"},
      {n:"Thuram Marcus",p:"FW"},{n:"Mbappe Kylian",p:"FW"},{n:"Olise Michael",p:"FW"},{n:"Barcola Bradley",p:"FW"},
      {n:"Kante Ngolo",p:"MF"},{n:"Rabiot Adrien",p:"MF"},{n:"Konate Ibrahima",p:"DF"},{n:"Maignan Mike",p:"GK"},
      {n:"Saliba William",p:"DF"},{n:"Zaire-emery Warren",p:"MF"},{n:"Hernandez Theo",p:"DF"},{n:"Doue Desire",p:"FW"},
      {n:"Hernandez Lucas",p:"DF"},{n:"Mateta Jean-philippe",p:"FW"},{n:"Risser Robin",p:"GK"},{n:"Cherki Rayan",p:"MF"},
      {n:"Akliouche Maghnes",p:"MF"},{n:"Lacroix Maxence",p:"DF"}
    ]
  },
  "Germany":{
    coach:"Julian Nagelsmann",conf:"UEFA",flag:"🇩🇪",rating:84,
    jersey:["#FFFFFF","#000000"],
    players:[
      {n:"Neuer Manuel",p:"GK"},{n:"Ruediger Antonio",p:"DF"},{n:"Anton Waldemar",p:"DF"},{n:"Tah Jonathan",p:"DF"},
      {n:"Pavlovic Aleksandar",p:"MF"},{n:"Kimmich Joshua",p:"DF"},{n:"Havertz Kai",p:"FW"},{n:"Goretzka Leon",p:"MF"},
      {n:"Leweling Jamie",p:"MF"},{n:"Musiala Jamal",p:"MF"},{n:"Woltemade Nick",p:"FW"},{n:"Baumann Oliver",p:"GK"},
      {n:"Gross Pascal",p:"MF"},{n:"Beier Maximilian",p:"FW"},{n:"Schlotterbeck Nico",p:"DF"},{n:"Stiller Angelo",p:"MF"},
      {n:"Wirtz Florian",p:"MF"},{n:"Brown Nathaniel",p:"DF"},{n:"Sane Leroy",p:"MF"},{n:"Amiri Nadiem",p:"MF"},
      {n:"Nuebel Alexander",p:"GK"},{n:"Raum David",p:"DF"},{n:"Nmecha Felix",p:"MF"},{n:"Thiaw Malick",p:"DF"},
      {n:"Karl Lennart",p:"MF"},{n:"Undav Deniz",p:"FW"}
    ]
  },
  "Ghana":{
    coach:"Carlos Queiroz",conf:"CAF",flag:"🇬🇭",rating:59,
    jersey:["#FFFFFF","#006B3F"],
    players:[
      {n:"Zigi Lawrence Ati",p:"GK"},{n:"Seidu Alidu",p:"DF"},{n:"Yirenkyi Caleb",p:"MF"},{n:"Adjetey Jonas",p:"DF"},
      {n:"Partey Thomas",p:"MF"},{n:"Mumin Abdul",p:"DF"},{n:"Issahaku Fatawu",p:"FW"},{n:"Sibo Kwasi",p:"MF"},
      {n:"Ayew Jordan",p:"FW"},{n:"Thomas-asante Brandon",p:"FW"},{n:"Semenyo Antoine",p:"MF"},{n:"Anang Joseph",p:"GK"},
      {n:"Baah Christopher Bonsu",p:"FW"},{n:"Mensah Gideon",p:"DF"},{n:"Owusu Elisha",p:"MF"},{n:"Asare Benjamin",p:"GK"},
      {n:"Rahman Baba",p:"DF"},{n:"Opoku Jerome",p:"DF"},{n:"Williams Inaki",p:"FW"},{n:"Boakye Augustine",p:"MF"},
      {n:"Oppong Kojo Peprah",p:"DF"},{n:"Sulemana Kamaldeen",p:"FW"},{n:"Luckassen Derrick",p:"DF"},{n:"Nuamah Ernest",p:"FW"},
      {n:"Adu Prince",p:"FW"},{n:"Senaya Marvin",p:"DF"}
    ]
  },
  "Haiti":{
    coach:"Sébastien Migné",conf:"CONCACAF",flag:"🇭🇹",rating:46,
    jersey:["#00209F","#D21034"],
    players:[
      {n:"Placide Johny",p:"GK"},{n:"Arcus Carlens",p:"DF"},{n:"Thermoncy Keeto",p:"DF"},{n:"Ade Ricardo",p:"DF"},
      {n:"Delcroix Hannes",p:"DF"},{n:"Sainte Carl",p:"MF"},{n:"Etienne Derrick",p:"FW"},{n:"Experience Martin",p:"DF"},
      {n:"Nazon Duckens",p:"FW"},{n:"Bellegarde Jean-ricner",p:"MF"},{n:"Deedson Louicius",p:"FW"},{n:"Pierre Alexandre",p:"GK"},
      {n:"Lacroix Markhus",p:"DF"},{n:"Pierre Leverton",p:"MF"},{n:"Providence Ruben",p:"FW"},{n:"Joseph Lenny",p:"FW"},
      {n:"Jean Jacques Danley",p:"MF"},{n:"Isidor Wilson",p:"FW"},{n:"Fortune Yassin",p:"FW"},{n:"Pierrot Frantzdy",p:"FW"},
      {n:"Casimir Josue",p:"FW"},{n:"Duverne Jean-kevin",p:"DF"},{n:"Duverger Josue",p:"GK"},{n:"Paugain Wilguens",p:"DF"},
      {n:"Simon Dominique",p:"MF"},{n:"Pierre Woodensky",p:"MF"}
    ]
  },
  "IR Iran":{
    coach:"Amir Ghalenoei",conf:"AFC",flag:"🇮🇷",rating:66,
    jersey:["#FFFFFF","#DA0000"],
    players:[
      {n:"Beiranvand Alireza",p:"GK"},{n:"Hardani Saleh",p:"DF"},{n:"Hajisafi Ehsan",p:"DF"},{n:"Khalilzadeh Shoja",p:"DF"},
      {n:"Mohammadi Milad",p:"DF"},{n:"Ezatolahi Saeid",p:"MF"},{n:"Jahanbakhsh Alireza",p:"MF"},{n:"Mohebbi Mohammad",p:"MF"},
      {n:"Taremi Mehdi",p:"FW"},{n:"Ghayedi Mehdi",p:"FW"},{n:"Alipour Ali",p:"FW"},{n:"Niazmand Payam",p:"GK"},
      {n:"Kanani Hossein",p:"DF"},{n:"Ghoddos Saman",p:"MF"},{n:"Cheshmi Roozbeh",p:"MF"},{n:"Torabi Mehdi",p:"MF"},
      {n:"Yousefi Arya",p:"DF"},{n:"Hosseinzadeh Amirhossein",p:"FW"},{n:"Nemati Ali",p:"DF"},{n:"Moghanloo Shahriyar",p:"FW"},
      {n:"Ghorbani Mohammad",p:"MF"},{n:"Hosseini Hossein",p:"GK"},{n:"Rezaeian Ramin",p:"DF"},{n:"Dargahi Dennis",p:"FW"},
      {n:"Iri Danial",p:"DF"},{n:"Razaghinia Amirmohammad",p:"MF"}
    ]
  },
  "Iraq":{
    coach:"Graham Arnold",conf:"AFC",flag:"🇮🇶",rating:56,
    jersey:["#FFFFFF","#007A3D"],
    players:[
      {n:"Fahad Talib",p:"GK"},{n:"Rebin Ghareeb",p:"DF"},{n:"Hussein Ali",p:"DF"},{n:"Zaid Tahseen",p:"DF"},
      {n:"Akam Hashim",p:"DF"},{n:"Munaf Younus",p:"DF"},{n:"Youssef Amyn",p:"MF"},{n:"Ibrahim Bayesh",p:"MF"},
      {n:"Ali Alhamadi",p:"FW"},{n:"Mohanad Ali",p:"FW"},{n:"Ahmed Qasim",p:"FW"},{n:"Jalal Hassan",p:"GK"},
      {n:"Ali Yousif",p:"FW"},{n:"Zidane Iqbal",p:"MF"},{n:"Ahmed Yahya",p:"DF"},{n:"Amir Alammari",p:"MF"},
      {n:"Ali Jasim",p:"FW"},{n:"Aymen Hussein",p:"FW"},{n:"Kevin Yakob",p:"MF"},{n:"Aimar Sher",p:"MF"},
      {n:"Marko Farji",p:"FW"},{n:"Ahmed Basil",p:"GK"},{n:"Merchas Doski",p:"DF"},{n:"Zaid Ismael",p:"MF"},
      {n:"Mustafa Saadoon",p:"DF"},{n:"Frans Putros",p:"DF"}
    ]
  },
  "Japan":{
    coach:"Hajime Moriyasu",conf:"AFC",flag:"🇯🇵",rating:79,
    jersey:["#00008B","#FFFFFF"],
    players:[
      {n:"Suzuki Zion",p:"GK"},{n:"Sugawara Yukinari",p:"DF"},{n:"Taniguchi Shogo",p:"DF"},{n:"Itakura Kou",p:"DF"},
      {n:"Nagatomo Yuto",p:"DF"},{n:"Endo Wataru",p:"MF"},{n:"Tanaka Ao",p:"MF"},{n:"Kubo Takefusa",p:"MF"},
      {n:"Goto Keisuke",p:"FW"},{n:"Doan Ritsu",p:"MF"},{n:"Maeda Daizen",p:"MF"},{n:"Osako Keisuke",p:"GK"},
      {n:"Nakamura Keito",p:"MF"},{n:"Ito Junya",p:"MF"},{n:"Kamada Daichi",p:"MF"},{n:"Watanabe Tsuyoshi",p:"DF"},
      {n:"Suzuki Yuito",p:"MF"},{n:"Ueda Ayase",p:"FW"},{n:"Ogawa Koki",p:"FW"},{n:"Seko Ayumu",p:"DF"},
      {n:"Ito Hiroki",p:"DF"},{n:"Tomiyasu Takehiro",p:"DF"},{n:"Hayakawa Tomoki",p:"GK"},{n:"Sano Kaishu",p:"MF"},
      {n:"Suzuki Junnosuke",p:"DF"},{n:"Shiogai Kento",p:"FW"}
    ]
  },
  "Jordan":{
    coach:"Jamal Sellami",conf:"AFC",flag:"🇯🇴",rating:53,
    jersey:["#FFFFFF","#CE1126"],
    players:[
      {n:"Yazeed Abulaila",p:"GK"},{n:"Mohammad Abuhasheesh",p:"DF"},{n:"Abdallah Nasib",p:"DF"},{n:"Husam Abudahab",p:"DF"},
      {n:"Yazan Alarab",p:"DF"},{n:"Amer Jamous",p:"MF"},{n:"Mohammad Abuzraiq",p:"FW"},{n:"Noor Alrawabdeh",p:"MF"},
      {n:"Ali Olwan",p:"FW"},{n:"Mousa Altamari",p:"FW"},{n:"Odeh Fakhoury",p:"FW"},{n:"Nour Baniateyah",p:"GK"},
      {n:"Mahmoud Almardi",p:"FW"},{n:"Rajaei Ayed",p:"MF"},{n:"Ibrahim Sadeh",p:"MF"},{n:"Mohammad Abualnadi",p:"DF"},
      {n:"Saleem Obaid",p:"DF"},{n:"Ibrahim Sabra",p:"FW"},{n:"Saed Alrosan",p:"DF"},{n:"Mohannad Abutaha",p:"MF"},
      {n:"Nizar Alrashdan",p:"MF"},{n:"Abdallah Alfakhori",p:"GK"},{n:"Ehsan Haddad",p:"DF"},{n:"Ali Azaizeh",p:"FW"},
      {n:"Mohammad Aldaoud",p:"MF"},{n:"Anas Badawi",p:"DF"}
    ]
  },
  "South Korea":{
    coach:"Myung Hong",conf:"AFC",flag:"🇰🇷",rating:76,
    jersey:["#C60C30","#003478"],
    players:[
      {n:"Kim Seunggyu",p:"GK"},{n:"Lee Hanbeom",p:"DF"},{n:"Lee Gihyuk",p:"MF"},{n:"Kim Minjae",p:"DF"},
      {n:"Kim Taehyeon",p:"DF"},{n:"Hwang Inbeom",p:"MF"},{n:"Son Heungmin",p:"FW"},{n:"Paik Seungho",p:"MF"},
      {n:"Cho Guesung",p:"FW"},{n:"Lee Jaesung",p:"MF"},{n:"Hwang Heechan",p:"MF"},{n:"Song Bumkeun",p:"GK"},
      {n:"Lee Taeseok",p:"DF"},{n:"Cho Wije",p:"DF"},{n:"Kim Moonhwan",p:"DF"},{n:"Park Jinseob",p:"DF"},
      {n:"Bae Junho",p:"MF"},{n:"Oh Hyeongyu",p:"FW"},{n:"Lee Kangin",p:"MF"},{n:"Yang Hyunjun",p:"MF"},
      {n:"Jo Hyeonwoo",p:"GK"},{n:"Seol Youngwoo",p:"DF"},{n:"Castrop Jens",p:"DF"},{n:"Kim Jingyu",p:"MF"},
      {n:"Eom Jisung",p:"MF"},{n:"Lee Donggyeong",p:"MF"}
    ]
  },
  "Mexico":{
    coach:"Javier Aguirre Onaindia",conf:"CONCACAF",flag:"🇲🇽",rating:79,
    jersey:["#006847","#CE1126"],
    players:[
      {n:"Rangel Raul",p:"GK"},{n:"Sanchez Jorge",p:"DF"},{n:"Montes Cesar",p:"DF"},{n:"Alvarez Edson",p:"DF"},
      {n:"Vasquez Johan",p:"DF"},{n:"Lira Erik",p:"MF"},{n:"Romo Luis",p:"MF"},{n:"Fidalgo Alvaro",p:"MF"},
      {n:"Jimenez Raul",p:"FW"},{n:"Vega Alexis",p:"FW"},{n:"Gimenez Santiago",p:"FW"},{n:"Acevedo Carlos",p:"GK"},
      {n:"Ochoa Guillermo",p:"GK"},{n:"Gonzalez Armando",p:"FW"},{n:"Reyes Israel",p:"DF"},{n:"Quinones Julian",p:"FW"},
      {n:"Pineda Orbelin",p:"MF"},{n:"Vargas Obed",p:"MF"},{n:"Mora Gilberto",p:"MF"},{n:"Chavez Mateo",p:"DF"},
      {n:"Huerta Cesar",p:"FW"},{n:"Martinez Guillermo",p:"FW"},{n:"Gallardo Jesus",p:"DF"},{n:"Chavez Luis",p:"MF"},
      {n:"Alvarado Roberto",p:"FW"},{n:"Gutierrez Brian",p:"MF"}
    ]
  },
  "Morocco":{
    coach:"Mohamed Ouahbi",conf:"CAF",flag:"🇲🇦",rating:82,
    jersey:["#C1272D","#006233"],
    players:[
      {n:"Bounou Yassine",p:"GK"},{n:"Hakimi Achraf",p:"DF"},{n:"Mazraoui Noussair",p:"DF"},{n:"Amrabat Sofyan",p:"MF"},
      {n:"Aguerd Nayef",p:"DF"},{n:"Bouaddi Ayyoub",p:"MF"},{n:"Talbi Chemsdine",p:"MF"},{n:"Ounahi Azzedine",p:"MF"},
      {n:"Rahimi Soufiane",p:"FW"},{n:"Diaz Brahim",p:"FW"},{n:"Saibari Ismael",p:"MF"},{n:"El Kajoui Munir",p:"GK"},
      {n:"El Ouahdi Zakaria",p:"DF"},{n:"Diop Issa",p:"DF"},{n:"El Mourabet Samir",p:"MF"},{n:"Yassine Gessime",p:"MF"},
      {n:"Ezzalzouli Abde",p:"FW"},{n:"Riad Chadi",p:"DF"},{n:"Belammari Youssef",p:"DF"},{n:"El Kaabi Ayoub",p:"FW"},
      {n:"Amaimouni Ayoub",p:"FW"},{n:"Tagnaouti Ahmed Reda",p:"GK"},{n:"El Khannouss Bilal",p:"MF"},{n:"El Aynaoui Neil",p:"MF"},
      {n:"Halhal Redouane",p:"DF"},{n:"Salah Eddine Anass",p:"DF"}
    ]
  },
  "Netherlands":{
    coach:"Ronald Koeman",conf:"UEFA",flag:"🇳🇱",rating:85,
    jersey:["#FF6600","#FFFFFF"],
    players:[
      {n:"Verbruggen Bart",p:"GK"},{n:"Timber Jurrien",p:"DF"},{n:"De Roon Marten",p:"MF"},{n:"Van Dijk Virgil",p:"DF"},
      {n:"Ake Nathan",p:"DF"},{n:"Van Hecke Jan Paul",p:"DF"},{n:"Kluivert Justin",p:"MF"},{n:"Gravenberch Ryan",p:"MF"},
      {n:"Weghorst Wout",p:"FW"},{n:"Depay Memphis",p:"FW"},{n:"Gakpo Cody",p:"FW"},{n:"Wieffer Mats",p:"DF"},
      {n:"Roefs Robin",p:"GK"},{n:"Reijnders Tijjani",p:"MF"},{n:"Van De Ven Micky",p:"DF"},{n:"Til Guus",p:"MF"},
      {n:"Lang Noa",p:"FW"},{n:"Malen Donyell",p:"FW"},{n:"Brobbey Brian",p:"FW"},{n:"Koopmeiners Teun",p:"MF"},
      {n:"De Jong Frenkie",p:"MF"},{n:"Dumfries Denzel",p:"DF"},{n:"Flekken Mark",p:"GK"},{n:"Summerville Crysencio",p:"FW"},
      {n:"Hato Jorrel",p:"DF"},{n:"Timber Quinten",p:"MF"}
    ]
  },
  "New Zealand":{
    coach:"Darren Bazeley",conf:"OFC",flag:"🇳🇿",rating:48,
    jersey:["#FFFFFF","#000000"],
    players:[
      {n:"Crocombe Max",p:"GK"},{n:"Payne Tim",p:"DF"},{n:"De Vries Francis",p:"DF"},{n:"Bindon Tyler",p:"DF"},
      {n:"Boxall Michael",p:"DF"},{n:"Bell Joe",p:"MF"},{n:"Garbett Matthew",p:"MF"},{n:"Stamenic Marko",p:"MF"},
      {n:"Wood Chris",p:"FW"},{n:"Singh Sarpreet",p:"MF"},{n:"Just Elijah",p:"MF"},{n:"Paulsen Alex",p:"GK"},
      {n:"Cacace Liberato",p:"DF"},{n:"Rufer Alex",p:"MF"},{n:"Pijnaker Nando",p:"DF"},{n:"Surman Finn",p:"DF"},
      {n:"Barbarouses Kosta",p:"FW"},{n:"Waine Ben",p:"FW"},{n:"Old Ben",p:"MF"},{n:"Mccowatt Callum",p:"MF"},
      {n:"Randall Jesse",p:"FW"},{n:"Woud Michael",p:"GK"},{n:"Thomas Ryan",p:"MF"},{n:"Elliot Callan",p:"DF"},
      {n:"Bayliss Lachlan",p:"MF"},{n:"Smith Tommy",p:"DF"}
    ]
  },
  "Norway":{
    coach:"Ståle Solbakken",conf:"UEFA",flag:"🇳🇴",rating:76,
    jersey:["#BA0C2F","#FFFFFF"],
    players:[
      {n:"Nyland Orjan",p:"GK"},{n:"Thorsby Morten",p:"MF"},{n:"Ajer Kristoffer",p:"DF"},{n:"Ostigard Leo",p:"DF"},
      {n:"Moller Wolfe David",p:"DF"},{n:"Berg Patrick",p:"MF"},{n:"Sorloth Alexander",p:"FW"},{n:"Berge Sander",p:"MF"},
      {n:"Haaland Erling",p:"FW"},{n:"Odegaard Martin",p:"MF"},{n:"Strand Larsen Jorgen",p:"FW"},{n:"Tangvik Sander",p:"GK"},
      {n:"Selvik Egil",p:"GK"},{n:"Aursnes Fredrik",p:"MF"},{n:"Bjorkan Fredrik Andre",p:"DF"},{n:"Holmgren Pedersen Marcus",p:"DF"},
      {n:"Heggem Torbjorn",p:"DF"},{n:"Thorstvedt Kristian",p:"MF"},{n:"Aasgaard Thelo",p:"MF"},{n:"Nusa Antonio",p:"FW"},
      {n:"Schjelderup Andreas",p:"MF"},{n:"Bobb Oscar",p:"MF"},{n:"Hauge Jens Petter",p:"MF"},{n:"Langas Sondre",p:"DF"},
      {n:"Falchener Henrik",p:"DF"},{n:"Ryerson Julian",p:"FW"}
    ]
  },
  "Panama":{
    coach:"Thomas Christiansen Tarin",conf:"CONCACAF",flag:"🇵🇦",rating:55,
    jersey:["#DA121A","#FFFFFF"],
    players:[
      {n:"Mejia Luis",p:"GK"},{n:"Blackman Cesar",p:"DF"},{n:"Cordoba Jose",p:"DF"},{n:"Escobar Fidel",p:"DF"},
      {n:"Farina Edgardo",p:"DF"},{n:"Martinez Cristian",p:"MF"},{n:"Rodriguez Jose Luis",p:"MF"},{n:"Carrasquilla Adalberto",p:"MF"},
      {n:"Rodriguez Tomas",p:"FW"},{n:"Diaz Ismael",p:"MF"},{n:"Barcenas Edgar Yoel",p:"MF"},{n:"Samudio Cesar",p:"GK"},
      {n:"Ramos Jiovany",p:"DF"},{n:"Harvey Carlos",p:"DF"},{n:"Davis Eric",p:"DF"},{n:"Andrade Andres",p:"DF"},
      {n:"Fajardo Jose",p:"FW"},{n:"Waterman Cecilio",p:"FW"},{n:"Quintero Alberto",p:"MF"},{n:"Godoy Anibal",p:"MF"},
      {n:"Yanis Cesar",p:"MF"},{n:"Mosquera Orlando",p:"GK"},{n:"Murillo Amir",p:"DF"},{n:"Londono Azarias",p:"FW"},
      {n:"Miller Roderick",p:"DF"},{n:"Gutierrez Jorge",p:"DF"}
    ]
  },
  "Paraguay":{
    coach:"Gustavo Alfaro",conf:"CONMEBOL",flag:"🇵🇾",rating:67,
    jersey:["#DA121A","#FFFFFF"],
    players:[
      {n:"Fernandez Gatito",p:"GK"},{n:"Velazquez Gustavo",p:"DF"},{n:"Alderete Omar",p:"DF"},{n:"Caceres Juan Jose",p:"DF"},
      {n:"Balbuena Fabian",p:"DF"},{n:"Alonso Junior",p:"DF"},{n:"Sosa Ramon",p:"MF"},{n:"Gomez Diego",p:"MF"},
      {n:"Sanabria Antonio",p:"FW"},{n:"Almiron Miguel",p:"MF"},{n:"Mauricio",p:"MF"},{n:"Gill Orlando",p:"GK"},
      {n:"Canale Jose",p:"DF"},{n:"Cubas Andres",p:"MF"},{n:"Gomez Gustavo",p:"DF"},{n:"Bobadilla Damian",p:"MF"},
      {n:"Romero Gamarra Alejandro",p:"FW"},{n:"Arce Alex",p:"FW"},{n:"Enciso Julio",p:"FW"},{n:"Ojeda Braian",p:"MF"},
      {n:"Avalos Gabriel",p:"FW"},{n:"Olveira Gaston",p:"GK"},{n:"Galarza Matias",p:"MF"},{n:"Caballero Gustavo",p:"MF"},
      {n:"Pitta Isidro",p:"FW"},{n:"Maidana Alexandro",p:"DF"}
    ]
  },
  "Portugal":{
    coach:"Roberto Martínez Montoliu",conf:"UEFA",flag:"🇵🇹",rating:87,
    jersey:["#006600","#FF0000"],
    players:[
      {n:"Diogo Costa",p:"GK"},{n:"Nelson Semedo",p:"DF"},{n:"Ruben Dias",p:"DF"},{n:"Tomas Araujo",p:"DF"},
      {n:"Diogo Dalot",p:"DF"},{n:"Matheus Nunes",p:"MF"},{n:"Cristiano Ronaldo",p:"FW"},{n:"Bruno Fernandes",p:"MF"},
      {n:"Goncalo Ramos",p:"FW"},{n:"Bernardo Silva",p:"MF"},{n:"Joao Felix",p:"FW"},{n:"Jose Sa",p:"GK"},
      {n:"Renato Veiga",p:"DF"},{n:"Goncalo Inacio",p:"DF"},{n:"Joao Neves",p:"MF"},{n:"Francisco Trincao",p:"FW"},
      {n:"Rafael Leao",p:"FW"},{n:"Pedro Neto",p:"FW"},{n:"Goncalo Guedes",p:"FW"},{n:"Joao Cancelo",p:"DF"},
      {n:"Ruben Neves",p:"MF"},{n:"Rui Silva",p:"GK"},{n:"Vitinha",p:"MF"},{n:"Samu Costa",p:"DF"},
      {n:"Nuno Mendes",p:"DF"},{n:"Francisco Conceicao",p:"FW"}
    ]
  },
  "Qatar":{
    coach:"Julian Lopetegui Argote",conf:"AFC",flag:"🇶🇦",rating:60,
    jersey:["#8D1B3D","#FFFFFF"],
    players:[
      {n:"Mahmoud Abunada",p:"GK"},{n:"Pedro Miguel",p:"DF"},{n:"Lucas Mendes",p:"DF"},{n:"Issa Laye",p:"DF"},
      {n:"Jassem Gaber",p:"DF"},{n:"Abdulaziz Hatem",p:"MF"},{n:"Ahmed Alaaeldin",p:"FW"},{n:"Edmilson Junior",p:"FW"},
      {n:"Mohammed Muntari",p:"FW"},{n:"Hassan Alhaydos",p:"FW"},{n:"Akram Afif",p:"FW"},{n:"Karim Boudiaf",p:"MF"},
      {n:"Ayoub Aloui",p:"DF"},{n:"Homam Ahmed",p:"DF"},{n:"Yusuf Abdurisag",p:"FW"},{n:"Boualem Khoukhi",p:"DF"},
      {n:"Ahmed Alganehi",p:"MF"},{n:"Sultan Albrake",p:"DF"},{n:"Almoez Ali",p:"FW"},{n:"Ahmed Fathy",p:"MF"},
      {n:"Salah Zakaria",p:"GK"},{n:"Meshaal Barsham",p:"GK"},{n:"Assim Madibo",p:"MF"},{n:"Tahsin Jamshid",p:"FW"},
      {n:"Alhashmi Alhussein",p:"DF"},{n:"Mohamed Manai",p:"FW"}
    ]
  },
  "Saudi Arabia":{
    coach:"Georgios Donis",conf:"AFC",flag:"🇸🇦",rating:63,
    jersey:["#006C35","#FFFFFF"],
    players:[
      {n:"Nawaf Alaqidi",p:"GK"},{n:"Ali Majrashi",p:"DF"},{n:"Ali Lajami",p:"DF"},{n:"Abdulelah Alamri",p:"DF"},
      {n:"Hassan Altambakti",p:"DF"},{n:"Nasser Aldawsari",p:"MF"},{n:"Musab Aljuwayr",p:"MF"},{n:"Aiman Yahya",p:"FW"},
      {n:"Feras Albrikan",p:"FW"},{n:"Salem Aldawsari",p:"FW"},{n:"Saleh Alshehri",p:"FW"},{n:"Saud Abdulhamid",p:"DF"},
      {n:"Nawaf Bu Washl",p:"DF"},{n:"Hassan Kadish",p:"DF"},{n:"Abdullah Alkhaibari",p:"MF"},{n:"Ziyad Aljohani",p:"MF"},
      {n:"Khalid Alghannam",p:"FW"},{n:"Ala Alhajji",p:"MF"},{n:"Abdullah Alhamddan",p:"FW"},{n:"Sultan Mandash",p:"FW"},
      {n:"Mohammed Alowais",p:"GK"},{n:"Ahmed Alkassar",p:"GK"},{n:"Mohamed Kanno",p:"MF"},{n:"Moteb Alharbi",p:"DF"},
      {n:"Jehad Thikri",p:"DF"},{n:"Mohammed Abu Alshamat",p:"DF"}
    ]
  },
  "Scotland":{
    coach:"Stephen Clarke",conf:"UEFA",flag:"🏴󠁧󠁢󠁳󠁣󠁴󠁿",rating:70,
    jersey:["#003399","#FFFFFF"],
    players:[
      {n:"Gunn Angus",p:"GK"},{n:"Hickey Aaron",p:"DF"},{n:"Robertson Andy",p:"DF"},{n:"Mctominay Scott",p:"MF"},
      {n:"Hanley Grant",p:"DF"},{n:"Tierney Kieran",p:"DF"},{n:"Mcginn John",p:"MF"},{n:"Fletcher Tyler",p:"MF"},
      {n:"Dykes Lyndon",p:"FW"},{n:"Adams Che",p:"FW"},{n:"Christie Ryan",p:"MF"},{n:"Kelly Liam",p:"GK"},
      {n:"Hendry Jack",p:"DF"},{n:"Stewart Ross",p:"FW"},{n:"Souttar John",p:"DF"},{n:"Hyam Dominic",p:"DF"},
      {n:"Gannon-doak Ben",p:"FW"},{n:"Hirst George",p:"FW"},{n:"Ferguson Lewis",p:"MF"},{n:"Shankland Lawrence",p:"FW"},
      {n:"Gordon Craig",p:"GK"},{n:"Patterson Nathan",p:"DF"},{n:"Mclean Kenny",p:"MF"},{n:"Ralston Anthony",p:"DF"},
      {n:"Curtis Findlay",p:"FW"},{n:"Mckenna Scott",p:"DF"}
    ]
  },
  "Senegal":{
    coach:"Pape Thiaw",conf:"CAF",flag:"🇸🇳",rating:77,
    jersey:["#FFFFFF","#00853F"],
    players:[
      {n:"Diouf Yehvann",p:"GK"},{n:"Sarr Mamadou",p:"DF"},{n:"Koulibaly Kalidou",p:"DF"},{n:"Seck Abdoulaye",p:"DF"},
      {n:"Gueye Idrissa Gana",p:"MF"},{n:"Ciss Pathe",p:"MF"},{n:"Diao Assane",p:"FW"},{n:"Camara Lamine",p:"MF"},
      {n:"Dieng Bamba",p:"FW"},{n:"Mane Sadio",p:"FW"},{n:"Jackson Nicolas",p:"FW"},{n:"Ndiaye Cherif",p:"FW"},
      {n:"Ndiaye Iliman",p:"FW"},{n:"Jakobs Ismail",p:"DF"},{n:"Diatta Krepin",p:"DF"},{n:"Mendy Edouard",p:"GK"},
      {n:"Sarr Pape Matar",p:"MF"},{n:"Sarr Ismaila",p:"FW"},{n:"Niakhate Moussa",p:"DF"},{n:"Mbaye Ibrahim",p:"FW"},
      {n:"Diarra Habib",p:"MF"},{n:"Ndiaye Bara Sapoko",p:"MF"},{n:"Diaw Mory",p:"GK"},{n:"Mendy Antoine",p:"DF"},
      {n:"Diouf El Hadji Malick",p:"DF"},{n:"Gueye Pape",p:"MF"}
    ]
  },
  "South Africa":{
    coach:"Hugo Broos",conf:"CAF",flag:"🇿🇦",rating:63,
    jersey:["#007749","#FFB81C"],
    players:[
      {n:"Williams Ronwen",p:"GK"},{n:"Matuludi Thabang",p:"DF"},{n:"Ndamane Khulumani",p:"DF"},{n:"Mokoena Teboho",p:"MF"},
      {n:"Mbatha Thalente",p:"MF"},{n:"Modiba Aubrey",p:"DF"},{n:"Appollis Oswin",p:"FW"},{n:"Moremi Tshepang",p:"FW"},
      {n:"Foster Lyle",p:"FW"},{n:"Mofokeng Relebohile",p:"FW"},{n:"Zwane Themba",p:"MF"},{n:"Maseko Thapelo",p:"FW"},
      {n:"Sithole Sphephelo",p:"MF"},{n:"Mbokazi Mbekezeli",p:"DF"},{n:"Rayners Iqraam",p:"FW"},{n:"Chaine Sipho",p:"GK"},
      {n:"Makgopa Evidence",p:"FW"},{n:"Kabini Samukelo",p:"DF"},{n:"Sibisi Nkosinathi",p:"DF"},{n:"Mudau Khuliso",p:"DF"},
      {n:"Okon Ime",p:"DF"},{n:"Goss Ricardo",p:"GK"},{n:"Adams Jayden",p:"MF"},{n:"Makhanya Olwethu",p:"DF"},
      {n:"Sebelebele Kamogelo",p:"FW"},{n:"Cross Bradley",p:"DF"}
    ]
  },
  "Spain":{
    coach:"Luis de la Fuente",conf:"UEFA",flag:"🇪🇸",rating:90,
    jersey:["#AA151B","#F1BF00"],
    players:[
      {n:"Raya David",p:"GK"},{n:"Pubill Marc",p:"DF"},{n:"Grimaldo Alex",p:"DF"},{n:"Garcia Eric",p:"DF"},
      {n:"Llorente Marcos",p:"DF"},{n:"Merino Mikel",p:"MF"},{n:"Torres Ferran",p:"FW"},{n:"Ruiz Fabian",p:"MF"},
      {n:"Gavi",p:"MF"},{n:"Olmo Dani",p:"FW"},{n:"Pino Yeremy",p:"FW"},{n:"Porro Pedro",p:"DF"},
      {n:"Garcia Joan",p:"GK"},{n:"Laporte Aymeric",p:"DF"},{n:"Baena Alex",p:"MF"},{n:"Rodri",p:"MF"},
      {n:"Williams Nico",p:"FW"},{n:"Zubimendi Martin",p:"MF"},{n:"Yamal Lamine",p:"FW"},{n:"Pedri",p:"MF"},
      {n:"Oyarzabal Mikel",p:"FW"},{n:"Cubarsi Pau",p:"DF"},{n:"Simon Unai",p:"GK"},{n:"Cucurella Marc",p:"DF"},
      {n:"Munoz Victor",p:"FW"},{n:"Iglesias Borja",p:"FW"}
    ]
  },
  "Sweden":{
    coach:"Graham Potter",conf:"UEFA",flag:"🇸🇪",rating:72,
    jersey:["#006AA7","#FECC00"],
    players:[
      {n:"Widell Zetterstrom Jacob",p:"GK"},{n:"Lagerbielke Gustaf",p:"DF"},{n:"Lindelof Victor",p:"DF"},{n:"Hien Isak",p:"DF"},
      {n:"Gudmundsson Gabriel",p:"DF"},{n:"Johansson Herman",p:"DF"},{n:"Bergvall Lucas",p:"MF"},{n:"Svensson Daniel",p:"DF"},
      {n:"Isak Alexander",p:"FW"},{n:"Nygren Benjamin",p:"MF"},{n:"Elanga Anthony",p:"FW"},{n:"Johansson Viktor",p:"GK"},
      {n:"Sema Ken",p:"MF"},{n:"Ekdal Hjalmar",p:"DF"},{n:"Starfelt Carl",p:"DF"},{n:"Karlstrom Jesper",p:"MF"},
      {n:"Gyokeres Viktor",p:"FW"},{n:"Ayari Yasin",p:"MF"},{n:"Svanberg Mattias",p:"MF"},{n:"Smith Eric",p:"DF"},
      {n:"Bernhardsson Alexander",p:"DF"},{n:"Zeneli Besfort",p:"MF"},{n:"Nordfeldt Kristoffer",p:"GK"},{n:"Stroud Elliot",p:"DF"},
      {n:"Nilsson Gustaf",p:"FW"},{n:"Ali Taha",p:"FW"}
    ]
  },
  "Switzerland":{
    coach:"Murat Yakin",conf:"UEFA",flag:"🇨🇭",rating:79,
    jersey:["#FF0000","#FFFFFF"],
    players:[
      {n:"Kobel Gregor",p:"GK"},{n:"Muheim Miro",p:"DF"},{n:"Widmer Silvan",p:"DF"},{n:"Elvedi Nico",p:"DF"},
      {n:"Akanji Manuel",p:"DF"},{n:"Zakaria Denis",p:"MF"},{n:"Embolo Breel",p:"FW"},{n:"Freuler Remo",p:"MF"},
      {n:"Manzambi Johan",p:"MF"},{n:"Xhaka Granit",p:"MF"},{n:"Ndoye Dan",p:"FW"},{n:"Mvogo Yvon",p:"GK"},
      {n:"Rodriguez Ricardo",p:"DF"},{n:"Jashari Ardon",p:"MF"},{n:"Sow Djibril",p:"MF"},{n:"Fassnacht Christian",p:"FW"},
      {n:"Vargas Ruben",p:"FW"},{n:"Coemert Eray",p:"DF"},{n:"Okafor Noah",p:"FW"},{n:"Aebischer Michel",p:"MF"},
      {n:"Keller Marvin",p:"GK"},{n:"Rieder Fabian",p:"MF"},{n:"Amdouni Zeki",p:"FW"},{n:"Amenda Aurele",p:"DF"},
      {n:"Jaquez Luca",p:"DF"},{n:"Itten Cedric",p:"FW"}
    ]
  },
  "Tunisia":{
    coach:"Sabri Lamouchi",conf:"CAF",flag:"🇹🇳",rating:64,
    jersey:["#CE1126","#FFFFFF"],
    players:[
      {n:"Chamakh Mouhib",p:"GK"},{n:"Abdi Ali",p:"DF"},{n:"Talbi Montassar",p:"DF"},{n:"Rekik Omar",p:"DF"},
      {n:"Arous Adam",p:"DF"},{n:"Bronn Dylan",p:"DF"},{n:"Achouri Elias",p:"FW"},{n:"Saad Elias",p:"FW"},
      {n:"Mastouri Hazem",p:"FW"},{n:"Mejbri Hannibal",p:"MF"},{n:"Gharbi Ismael",p:"MF"},{n:"Ben Ouanes Mortadha",p:"DF"},
      {n:"Khedira Rani",p:"MF"},{n:"Ayari Khalil",p:"MF"},{n:"Hadj Mahmoud Mohamed",p:"MF"},{n:"Dahmen Aymen",p:"GK"},
      {n:"Skhiri Ellyes",p:"MF"},{n:"Elloumi Rayan",p:"FW"},{n:"Chaouat Firas",p:"FW"},{n:"Valery Yan",p:"DF"},
      {n:"Ben Hmida Mohamed Amine",p:"DF"},{n:"Ben Hessen Sabri",p:"GK"},{n:"Neffati Moutaz",p:"DF"},{n:"Chikhaoui Raed",p:"DF"},
      {n:"Slimane Anis",p:"MF"},{n:"Tounekti Sebastian",p:"MF"}
    ]
  },
  "Türkiye":{
    coach:"Vincenzo Montella",conf:"UEFA",flag:"🇹🇷",rating:75,
    jersey:["#E30A17","#FFFFFF"],
    players:[
      {n:"Gunok Mert",p:"GK"},{n:"Celik Zeki",p:"DF"},{n:"Demiral Merih",p:"DF"},{n:"Soyuncu Caglar",p:"DF"},
      {n:"Ozcan Salih",p:"MF"},{n:"Kokcu Orkun",p:"MF"},{n:"Akturkoglu Kerem",p:"FW"},{n:"Guler Arda",p:"FW"},
      {n:"Gul Deniz",p:"FW"},{n:"Calhanoglu Hakan",p:"MF"},{n:"Yildiz Kenan",p:"FW"},{n:"Bayindir Altay",p:"GK"},
      {n:"Elmali Eren",p:"DF"},{n:"Bardakci Abdulkerim",p:"DF"},{n:"Kabak Ozan",p:"DF"},{n:"Yuksek Ismail",p:"MF"},
      {n:"Kahveci Irfan Can",p:"FW"},{n:"Muldur Mert",p:"DF"},{n:"Akgun Yunus",p:"FW"},{n:"Kadioglu Ferdi",p:"DF"},
      {n:"Yilmaz Baris Alper",p:"FW"},{n:"Ayhan Kaan",p:"MF"},{n:"Cakir Ugurcan",p:"GK"},{n:"Aydin Oguz",p:"FW"},
      {n:"Akaydin Samet",p:"DF"},{n:"Uzun Can",p:"FW"}
    ]
  },
  "Uruguay":{
    coach:"Marcelo Bielsa",conf:"CONMEBOL",flag:"🇺🇾",rating:80,
    jersey:["#5CBFEB","#FFFFFF"],
    players:[
      {n:"Rochet Sergio",p:"GK"},{n:"Gimenez Jose Maria",p:"DF"},{n:"Caceres Sebastian",p:"DF"},{n:"Araujo Ronald",p:"DF"},
      {n:"Ugarte Manuel",p:"MF"},{n:"Bentancur Rodrigo",p:"MF"},{n:"De La Cruz Nicolas",p:"MF"},{n:"Valverde Federico",p:"MF"},
      {n:"Nunez Darwin",p:"FW"},{n:"De Arrascaeta Giorgian",p:"MF"},{n:"Pellistri Facundo",p:"FW"},{n:"Mele Santiago",p:"GK"},
      {n:"Varela Guillermo",p:"DF"},{n:"Canobbio Agustin",p:"MF"},{n:"Martinez Emiliano",p:"MF"},{n:"Olivera Mathias",p:"DF"},
      {n:"Vina Matias",p:"DF"},{n:"Rodriguez Brian",p:"FW"},{n:"Aguirre Rodrigo",p:"FW"},{n:"Araujo Maxi",p:"MF"},
      {n:"Vinas Federico",p:"FW"},{n:"Piquerez Joaquin",p:"MF"},{n:"Muslera Fernando",p:"GK"},{n:"Bueno Santiago",p:"DF"},
      {n:"Sanabria Juan Manuel",p:"MF"},{n:"Zalazar Rodrigo",p:"MF"}
    ]
  },
  "USA":{
    coach:"Mauricio Pochettino",conf:"CONCACAF",flag:"🇺🇸",rating:80,
    jersey:["#002868","#BF0A30"],
    players:[
      {n:"Turner Matt",p:"GK"},{n:"Dest Sergino",p:"DF"},{n:"Richards Chris",p:"DF"},{n:"Adams Tyler",p:"MF"},
      {n:"Robinson Antonee",p:"DF"},{n:"Trusty Auston",p:"DF"},{n:"Reyna Giovanni",p:"MF"},{n:"Mckennie Weston",p:"MF"},
      {n:"Pepi Ricardo",p:"FW"},{n:"Pulisic Christian",p:"FW"},{n:"Aaronson Brenden",p:"FW"},{n:"Robinson Miles",p:"DF"},
      {n:"Ream Tim",p:"DF"},{n:"Berhalter Sebastian",p:"MF"},{n:"Roldan Cristian",p:"MF"},{n:"Freeman Alex",p:"DF"},
      {n:"Tillman Malik",p:"MF"},{n:"Arfsten Max",p:"DF"},{n:"Wright Haji",p:"FW"},{n:"Balogun Folarin",p:"FW"},
      {n:"Weah Timothy",p:"FW"},{n:"Mckenzie Mark",p:"DF"},{n:"Scally Joe",p:"DF"},{n:"Freese Matt",p:"GK"},
      {n:"Brady Chris",p:"GK"},{n:"Zendejas Alex",p:"FW"}
    ]
  },
  "Uzbekistan":{
    coach:"Fabio Cannavaro",conf:"AFC",flag:"🇺🇿",rating:59,
    jersey:["#FFFFFF","#1EB53A"],
    players:[
      {n:"Yusupov Utkir",p:"GK"},{n:"Khusanov Abdukodir",p:"DF"},{n:"Alijonov Khojiakbar",p:"DF"},{n:"Sayfiev Farrukh",p:"DF"},
      {n:"Ashurmatov Rustam",p:"DF"},{n:"Mozgovoy Akmal",p:"MF"},{n:"Shukurov Otabek",p:"MF"},{n:"Iskanderov Jamshid",p:"MF"},
      {n:"Xamrobekov Odiljon",p:"MF"},{n:"Masharipov Jaloliddin",p:"MF"},{n:"Urunov Oston",p:"MF"},{n:"Nematov Abduvohid",p:"GK"},
      {n:"Nasrullaev Sherzod",p:"DF"},{n:"Shomurodov Eldor",p:"FW"},{n:"Eshmurodov Umar",p:"DF"},{n:"Ergashev Botirali",p:"GK"},
      {n:"Khamdamov Dostonbek",p:"MF"},{n:"Abdullaev Abdulla",p:"DF"},{n:"Ganiev Azizjon",p:"MF"},{n:"Amonov Azizbek",p:"FW"},
      {n:"Sergeev Igor",p:"FW"},{n:"Fayzullaev Abbosbek",p:"MF"},{n:"Esanov Sherzod",p:"MF"},{n:"Karimov Behruzjon",p:"DF"},
      {n:"Ulmasaliyev Avazbek",p:"DF"},{n:"Urozov Jakhongir",p:"DF"}
    ]
  },
};

const GROUPS={
  A:["Mexico","South Africa","South Korea","Czechia"],
  B:["Canada","Bosnia & Herzegovina","Qatar","Switzerland"],
  C:["Brazil","Morocco","Haiti","Scotland"],
  D:["USA","Paraguay","Australia","Türkiye"],
  E:["Germany","Curaçao","Côte d'Ivoire","Ecuador"],
  F:["Netherlands","Japan","Sweden","Tunisia"],
  G:["Belgium","Egypt","IR Iran","New Zealand"],
  H:["Spain","Cabo Verde","Saudi Arabia","Uruguay"],
  I:["France","Senegal","Iraq","Norway"],
  J:["Argentina","Algeria","Austria","Jordan"],
  K:["Portugal","Congo DR","Uzbekistan","Colombia"],
  L:["England","Croatia","Ghana","Panama"],
};
// ── CONSTANTS ──
const DATA_VERIFIED = "June 8, 2026";
const SHOW_ADMIN = false; // set true locally to see Revenue tab
const DATA_SOURCE   = "FIFA published final squad lists (June 2, 2026); independent app data last reviewed June 8, 2026. Squad changes due to serious injury may occur up to 24 hours before a team's first match.";

// ── AUDIT ──
const VALID_CONFS=["UEFA","CONMEBOL","CONCACAF","CAF","AFC","OFC"];
const AUDIT=(()=>{
  const squadRows=Object.entries(SQUADS).map(([t,d])=>({
    t,n:d.players?.length||0,ok:d.players?.length===26,
    badConf:!VALID_CONFS.includes(d.conf),
    badFlag:!d.flag||d.flag==="🏳️",
    badCoach:!d.coach||d.coach==="TBD",
  }));
  const groupTeams=Object.values(GROUPS).flat();
  const groupSet=new Set(groupTeams);
  const squadSet=new Set(Object.keys(SQUADS));
  const missingFromSquads=groupTeams.filter(t=>!squadSet.has(t));
  const unusedSquads=Object.keys(SQUADS).filter(t=>!groupSet.has(t));
  const duplicates=groupTeams.filter((t,i,a)=>a.indexOf(t)!==i);
  const playerIssues=Object.entries(SQUADS).flatMap(([team,d])=>{
    const gks=(d.players||[]).filter(p=>p.p==="GK").length;
    const names=(d.players||[]).map(p=>p.n);
    const dupes=names.filter((n,i,a)=>a.indexOf(n)!==i);
    return[...(gks<3?[`${team}: only ${gks} GKs`]:[]),...dupes.map(n=>`${team}: duplicate ${n}`)];
  });
  const issues=[
    ...squadRows.filter(x=>!x.ok).map(x=>`${x.t}: ${x.n} players`),
    ...squadRows.filter(x=>x.badConf).map(x=>`${x.t}: invalid conf`),
    ...squadRows.filter(x=>x.badFlag).map(x=>`${x.t}: placeholder flag`),
    ...squadRows.filter(x=>x.badCoach).map(x=>`${x.t}: missing coach`),
    ...missingFromSquads.map(t=>`${t}: in GROUPS but missing from SQUADS`),
    ...unusedSquads.map(t=>`${t}: in SQUADS but not in GROUPS`),
    ...duplicates.map(t=>`${t}: duplicated in GROUPS`),
    ...playerIssues,
  ];
  return{ok:issues.length===0&&groupTeams.length===48&&squadRows.length===48,
    tot:squadRows.reduce((s,x)=>s+x.n,0),teams:squadRows.length,
    groupTeams:groupTeams.length,issues};
})();

// ── TEAM LOOKUP ──
const getT=n=>SQUADS[n]?{name:n,...SQUADS[n]}:{name:n,flag:"🏳️",rating:50,jersey:["#64748b","#e2e8f0"],players:[],coach:"TBD",conf:"—"};

// ── SCENARIOS ──
const SCENARIOS=[
  {id:"std",icon:"🎲",l:"Standard",    d:"Current team ratings",        a:{}},
  {id:"dog",icon:"🐕",l:"Underdogs",   d:"Weaker teams get +18 boost",  a:{t:"dog"}},
  {id:"chaos",icon:"🌪️",l:"Chaos Mode",d:"Ratings fully randomised",   a:{t:"chaos"}},
  {id:"host",icon:"🏟️",l:"Host Boost", d:"USA · Mexico · Canada +15",   a:{t:"host"}},
  {id:"eur", icon:"⚽",l:"UEFA Surge",  d:"All European teams +12",      a:{t:"conf",c:"UEFA",v:12}},
  {id:"sam", icon:"💃",l:"CONMEBOL",   d:"South American teams +14",    a:{t:"conf",c:"CONMEBOL",v:14}},
  {id:"afr", icon:"🌍",l:"Africa Rise", d:"African teams +16",           a:{t:"conf",c:"CAF",v:16}},
  {id:"asia",icon:"🐉",l:"Asian Wave",  d:"AFC and OFC teams +18",       a:{t:"conf",c:"AFC",v:18}},
  {id:"def", icon:"🧱",l:"Bunker Ball", d:"Low-scoring defensive grind", a:{t:"defense"}},
  {id:"gol", icon:"💥",l:"Goal Fest",   d:"Open play, high scoring",    a:{t:"goals"}},
];


// ── LIVE DATA ENGINE ──
// Free live scores via ESPN public API (no key needed)
// ESPN API: https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard
// Falls back gracefully if unavailable - sim uses static data, live layer overlays real results

// LIVE_STATE is a module-level cache only — React state is in App()
const LIVE_STATE = {
  matches: {},   // espnId -> normalized match object
  byKey: {},     // "GROUP-G1-Germany-Curaçao" -> result (locked group matches)
  lastFetch: null,
  error: null,
};

// Build a deterministic match key: stage + group/round + sorted team names
function makeMatchKey(stage, t1, t2){
  const sorted=[t1,t2].sort().join("__");
  return `${stage}__${sorted}`;
}

// Map ESPN team names to our SQUADS keys
const ESPN_NAME_MAP = {
  "United States":"USA",
  "Iran":"IR Iran",
  "Korea Republic":"South Korea","Republic of Korea":"South Korea",
  "DR Congo":"Congo DR","Democratic Republic of Congo":"Congo DR","DRC":"Congo DR",
  "Bosnia-Herzegovina":"Bosnia & Herzegovina","Bosnia and Herzegovina":"Bosnia & Herzegovina",
  "Turkey":"Türkiye","Turkiye":"Türkiye",
  "Ivory Coast":"Côte d'Ivoire","Cote d'Ivoire":"Côte d'Ivoire","Côte D'Ivoire":"Côte d'Ivoire",
  "Curacao":"Curaçao","Curaçao":"Curaçao",
  "Cape Verde":"Cabo Verde","Cabo Verde Islands":"Cabo Verde",
  "New Zealand":"New Zealand","Czechia":"Czechia","Czech Republic":"Czechia",
  "Saudi Arabia":"Saudi Arabia","South Korea":"South Korea",
};

function normalizeTeamName(name){
  return ESPN_NAME_MAP[name]||name;
}

// ═══════════════════════════════════════════════════════════════
// SIMULATION ENGINE
// ═══════════════════════════════════════════════════════════════

// ── OFFICIAL MATCH SCHEDULE (72 group matches, IDs 1-72) ──
const OFFICIAL_MATCHES = (() => {
  const GRP_TEAMS = {
    A:["Mexico","South Africa","South Korea","Czechia"],
    B:["Canada","Bosnia & Herzegovina","Qatar","Switzerland"],
    C:["Brazil","Morocco","Haiti","Scotland"],
    D:["USA","Paraguay","Australia","Türkiye"],
    E:["Germany","Curaçao","Côte d'Ivoire","Ecuador"],
    F:["Netherlands","Japan","Sweden","Tunisia"],
    G:["Belgium","Egypt","IR Iran","New Zealand"],
    H:["Spain","Cabo Verde","Saudi Arabia","Uruguay"],
    I:["France","Senegal","Iraq","Norway"],
    J:["Argentina","Algeria","Austria","Jordan"],
    K:["Portugal","Congo DR","Uzbekistan","Colombia"],
    L:["England","Croatia","Ghana","Panama"],
  };
  // Round-robin pairings for 4 teams: [0v1,2v3,0v2,1v3,0v3,1v2]
  const PAIRS=[[0,1],[2,3],[0,2],[1,3],[0,3],[1,2]];
  const all=[];let id=1;
  Object.entries(GRP_TEAMS).forEach(([g,ts])=>{
    PAIRS.forEach(([a,b])=>{all.push({id:id++,stage:"group",group:g,home:ts[a],away:ts[b]});});
  });
  return all; // 72 matches IDs 1–72
})();

// ── RESULT STATE (locked real results drive simAll) ──
const RESULT_STATE = { byMatchId:{} };

// ── REAL MATCH RESULTS (manually verified — never overwritten by API) ──
// Sources: Reuters, CBS Sports, Canada Soccer — verified June 13, 2026
const MANUAL_VERIFIED_RESULTS = {
  1:{id:1,home:"Mexico",away:"South Africa",homeScore:2,awayScore:0,
     status:"post",locked:true,source:"Verified (Reuters/CBS)",updatedAt:"2026-06-11",
     penalties:false,homePens:0,awayPens:0,homeAdvances:true},
  2:{id:2,home:"South Korea",away:"Czechia",homeScore:2,awayScore:1,
     status:"post",locked:true,source:"Verified (Reuters/CBS)",updatedAt:"2026-06-11",
     penalties:false,homePens:0,awayPens:0,homeAdvances:true},
  7:{id:7,home:"Canada",away:"Bosnia & Herzegovina",homeScore:1,awayScore:1,
     status:"post",locked:true,source:"Verified (Canada Soccer/CBS)",updatedAt:"2026-06-12",
     penalties:false,homePens:0,awayPens:0,homeAdvances:false},
  19:{id:19,home:"USA",away:"Paraguay",homeScore:4,awayScore:1,
      status:"post",locked:true,source:"Verified (Reuters/CBS)",updatedAt:"2026-06-13",
      penalties:false,homePens:0,awayPens:0,homeAdvances:true},
  // Group B Match 1 — Levi's Stadium, Santa Clara
  8:{id:8,home:"Qatar",away:"Switzerland",homeScore:1,awayScore:1,
     status:"post",locked:true,source:"Verified (Yahoo Sports/ESPN)",updatedAt:"2026-06-13",
     penalties:false,homePens:0,awayPens:0,homeAdvances:false},
  // Group C Match 1 — MetLife Stadium, East Rutherford
  13:{id:13,home:"Brazil",away:"Morocco",homeScore:1,awayScore:1,
      status:"post",locked:true,source:"Verified (Yahoo Sports/ESPN)",updatedAt:"2026-06-13",
      penalties:false,homePens:0,awayPens:0,homeAdvances:false},
};
// Seed RESULT_STATE immediately at load
Object.assign(RESULT_STATE.byMatchId, MANUAL_VERIFIED_RESULTS);

// ── OFFICIAL R32 BRACKET SLOTS ──
const OFFICIAL_R32_SLOTS=[
  {id:73,a:{type:"runner",group:"A"},b:{type:"runner",group:"B"}},
  {id:74,a:{type:"winner",group:"E"},b:{type:"third",allowed:["A","B","C","D","F"]}},
  {id:75,a:{type:"winner",group:"F"},b:{type:"runner",group:"C"}},
  {id:76,a:{type:"winner",group:"C"},b:{type:"runner",group:"F"}},
  {id:77,a:{type:"winner",group:"I"},b:{type:"third",allowed:["C","D","F","G","H"]}},
  {id:78,a:{type:"runner",group:"E"},b:{type:"runner",group:"I"}},
  {id:79,a:{type:"winner",group:"A"},b:{type:"third",allowed:["C","E","F","H","I"]}},
  {id:80,a:{type:"winner",group:"L"},b:{type:"third",allowed:["E","H","I","J","K"]}},
  {id:81,a:{type:"winner",group:"D"},b:{type:"third",allowed:["B","E","F","I","J"]}},
  {id:82,a:{type:"winner",group:"G"},b:{type:"third",allowed:["A","E","H","I","J"]}},
  {id:83,a:{type:"runner",group:"K"},b:{type:"runner",group:"L"}},
  {id:84,a:{type:"winner",group:"H"},b:{type:"runner",group:"J"}},
  {id:85,a:{type:"winner",group:"B"},b:{type:"third",allowed:["E","F","G","I","J"]}},
  {id:86,a:{type:"winner",group:"J"},b:{type:"runner",group:"H"}},
  {id:87,a:{type:"winner",group:"K"},b:{type:"third",allowed:["D","E","I","J","L"]}},
  {id:88,a:{type:"runner",group:"D"},b:{type:"runner",group:"G"}},
];
const OFFICIAL_R16=[
  {id:89,from:[74,77]},{id:90,from:[73,75]},
  {id:91,from:[76,78]},{id:92,from:[79,80]},
  {id:93,from:[83,84]},{id:94,from:[81,82]},
  {id:95,from:[86,88]},{id:96,from:[85,87]},
];
const OFFICIAL_QF=[{id:97,from:[89,90]},{id:98,from:[93,94]},{id:99,from:[91,92]},{id:100,from:[95,96]}];
const OFFICIAL_SF=[{id:101,from:[97,98]},{id:102,from:[99,100]}];

const THIRD_PLACE_ASSIGNMENTS = {
  "A,B,C,D,E,F,G,H":{74:"B",77:"F",79:"C",80:"H",81:"E",82:"A",85:"G",87:"D"},
  "A,B,C,D,E,F,G,I":{74:"B",77:"F",79:"C",80:"E",81:"I",82:"A",85:"G",87:"D"},
  "A,B,C,D,E,F,G,J":{74:"B",77:"F",79:"C",80:"J",81:"E",82:"A",85:"G",87:"D"},
  "A,B,C,D,E,F,G,K":{74:"B",77:"F",79:"C",80:"K",81:"E",82:"A",85:"G",87:"D"},
  "A,B,C,D,E,F,G,L":{74:"B",77:"D",79:"C",80:"E",81:"F",82:"A",85:"G",87:"L"},
  "A,B,C,D,E,F,H,I":{74:"B",77:"F",79:"C",80:"H",81:"E",82:"A",85:"I",87:"D"},
  "A,B,C,D,E,F,H,J":{74:"B",77:"F",79:"C",80:"H",81:"J",82:"A",85:"E",87:"D"},
  "A,B,C,D,E,F,H,K":{74:"B",77:"C",79:"H",80:"K",81:"F",82:"A",85:"E",87:"D"},
  "A,B,C,D,E,F,H,L":{74:"B",77:"D",79:"C",80:"H",81:"F",82:"A",85:"E",87:"L"},
  "A,B,C,D,E,F,I,J":{74:"B",77:"F",79:"C",80:"I",81:"J",82:"A",85:"E",87:"D"},
  "A,B,C,D,E,F,I,K":{74:"B",77:"F",79:"C",80:"K",81:"E",82:"A",85:"I",87:"D"},
  "A,B,C,D,E,F,I,L":{74:"B",77:"D",79:"C",80:"E",81:"F",82:"A",85:"I",87:"L"},
  "A,B,C,D,E,F,J,K":{74:"B",77:"F",79:"C",80:"K",81:"J",82:"A",85:"E",87:"D"},
  "A,B,C,D,E,F,J,L":{74:"B",77:"D",79:"C",80:"J",81:"F",82:"A",85:"E",87:"L"},
  "A,B,C,D,E,F,K,L":{74:"B",77:"D",79:"C",80:"K",81:"F",82:"A",85:"E",87:"L"},
  "A,B,C,D,E,G,H,I":{74:"B",77:"G",79:"C",80:"H",81:"E",82:"A",85:"I",87:"D"},
  "A,B,C,D,E,G,H,J":{74:"B",77:"G",79:"C",80:"H",81:"J",82:"A",85:"E",87:"D"},
  "A,B,C,D,E,G,H,K":{74:"B",77:"C",79:"H",80:"K",81:"E",82:"A",85:"G",87:"D"},
  "A,B,C,D,E,G,H,L":{74:"B",77:"D",79:"C",80:"H",81:"E",82:"A",85:"G",87:"L"},
  "A,B,C,D,E,G,I,J":{74:"B",77:"G",79:"C",80:"I",81:"J",82:"A",85:"E",87:"D"},
  "A,B,C,D,E,G,I,K":{74:"B",77:"G",79:"C",80:"K",81:"E",82:"A",85:"I",87:"D"},
  "A,B,C,D,E,G,I,L":{74:"B",77:"D",79:"C",80:"E",81:"I",82:"A",85:"G",87:"L"},
  "A,B,C,D,E,G,J,K":{74:"B",77:"G",79:"C",80:"K",81:"J",82:"A",85:"E",87:"D"},
  "A,B,C,D,E,G,J,L":{74:"B",77:"D",79:"C",80:"J",81:"E",82:"A",85:"G",87:"L"},
  "A,B,C,D,E,G,K,L":{74:"B",77:"D",79:"C",80:"K",81:"E",82:"A",85:"G",87:"L"},
  "A,B,C,D,E,H,I,J":{74:"B",77:"D",79:"C",80:"H",81:"I",82:"A",85:"J",87:"E"},
  "A,B,C,D,E,H,I,K":{74:"B",77:"C",79:"H",80:"K",81:"E",82:"A",85:"I",87:"D"},
  "A,B,C,D,E,H,I,L":{74:"B",77:"D",79:"C",80:"H",81:"E",82:"A",85:"I",87:"L"},
  "A,B,C,D,E,H,J,K":{74:"B",77:"C",79:"H",80:"K",81:"J",82:"A",85:"E",87:"D"},
  "A,B,C,D,E,H,J,L":{74:"B",77:"D",79:"C",80:"H",81:"J",82:"A",85:"E",87:"L"},
  "A,B,C,D,E,H,K,L":{74:"A",77:"D",79:"C",80:"K",81:"B",82:"H",85:"E",87:"L"},
  "A,B,C,D,E,I,J,K":{74:"B",77:"D",79:"C",80:"K",81:"I",82:"A",85:"J",87:"E"},
  "A,B,C,D,E,I,J,L":{74:"B",77:"D",79:"C",80:"I",81:"J",82:"A",85:"E",87:"L"},
  "A,B,C,D,E,I,K,L":{74:"B",77:"D",79:"C",80:"K",81:"E",82:"A",85:"I",87:"L"},
  "A,B,C,D,E,J,K,L":{74:"B",77:"D",79:"C",80:"K",81:"J",82:"A",85:"E",87:"L"},
  "A,B,C,D,F,G,H,I":{74:"B",77:"F",79:"C",80:"H",81:"I",82:"A",85:"G",87:"D"},
  "A,B,C,D,F,G,H,J":{74:"B",77:"F",79:"C",80:"H",81:"J",82:"A",85:"G",87:"D"},
  "A,B,C,D,F,G,H,K":{74:"B",77:"C",79:"H",80:"K",81:"F",82:"A",85:"G",87:"D"},
  "A,B,C,D,F,G,H,L":{74:"B",77:"D",79:"C",80:"H",81:"F",82:"A",85:"G",87:"L"},
  "A,B,C,D,F,G,I,J":{74:"B",77:"F",79:"C",80:"J",81:"I",82:"A",85:"G",87:"D"},
  "A,B,C,D,F,G,I,K":{74:"B",77:"F",79:"C",80:"K",81:"I",82:"A",85:"G",87:"D"},
  "A,B,C,D,F,G,I,L":{74:"B",77:"D",79:"C",80:"I",81:"F",82:"A",85:"G",87:"L"},
  "A,B,C,D,F,G,J,K":{74:"B",77:"F",79:"C",80:"K",81:"J",82:"A",85:"G",87:"D"},
  "A,B,C,D,F,G,J,L":{74:"B",77:"D",79:"C",80:"J",81:"F",82:"A",85:"G",87:"L"},
  "A,B,C,D,F,G,K,L":{74:"B",77:"D",79:"C",80:"K",81:"F",82:"A",85:"G",87:"L"},
  "A,B,C,D,F,H,I,J":{74:"B",77:"F",79:"C",80:"H",81:"I",82:"A",85:"J",87:"D"},
  "A,B,C,D,F,H,I,K":{74:"B",77:"C",79:"H",80:"K",81:"F",82:"A",85:"I",87:"D"},
  "A,B,C,D,F,H,I,L":{74:"B",77:"D",79:"C",80:"H",81:"F",82:"A",85:"I",87:"L"},
  "A,B,C,D,F,H,J,K":{74:"B",77:"C",79:"H",80:"K",81:"F",82:"A",85:"J",87:"D"},
  "A,B,C,D,F,H,J,L":{74:"B",77:"D",79:"C",80:"H",81:"F",82:"A",85:"J",87:"L"},
  "A,B,C,D,F,H,K,L":{74:"A",77:"D",79:"C",80:"K",81:"B",82:"H",85:"F",87:"L"},
  "A,B,C,D,F,I,J,K":{74:"B",77:"F",79:"C",80:"K",81:"J",82:"A",85:"I",87:"D"},
  "A,B,C,D,F,I,J,L":{74:"B",77:"D",79:"C",80:"I",81:"F",82:"A",85:"J",87:"L"},
  "A,B,C,D,F,I,K,L":{74:"B",77:"D",79:"C",80:"K",81:"F",82:"A",85:"I",87:"L"},
  "A,B,C,D,F,J,K,L":{74:"B",77:"D",79:"C",80:"K",81:"F",82:"A",85:"J",87:"L"},
  "A,B,C,D,G,H,I,J":{74:"B",77:"G",79:"C",80:"H",81:"I",82:"A",85:"J",87:"D"},
  "A,B,C,D,G,H,I,K":{74:"B",77:"C",79:"H",80:"K",81:"I",82:"A",85:"G",87:"D"},
  "A,B,C,D,G,H,I,L":{74:"B",77:"D",79:"C",80:"H",81:"I",82:"A",85:"G",87:"L"},
  "A,B,C,D,G,H,J,K":{74:"B",77:"C",79:"H",80:"K",81:"J",82:"A",85:"G",87:"D"},
  "A,B,C,D,G,H,J,L":{74:"B",77:"D",79:"C",80:"H",81:"J",82:"A",85:"G",87:"L"},
  "A,B,C,D,G,H,K,L":{74:"A",77:"D",79:"C",80:"K",81:"B",82:"H",85:"G",87:"L"},
  "A,B,C,D,G,I,J,K":{74:"B",77:"G",79:"C",80:"K",81:"J",82:"A",85:"I",87:"D"},
  "A,B,C,D,G,I,J,L":{74:"B",77:"D",79:"C",80:"I",81:"J",82:"A",85:"G",87:"L"},
  "A,B,C,D,G,I,K,L":{74:"B",77:"D",79:"C",80:"K",81:"I",82:"A",85:"G",87:"L"},
  "A,B,C,D,G,J,K,L":{74:"B",77:"D",79:"C",80:"K",81:"J",82:"A",85:"G",87:"L"},
  "A,B,C,D,H,I,J,K":{74:"B",77:"C",79:"H",80:"K",81:"I",82:"A",85:"J",87:"D"},
  "A,B,C,D,H,I,J,L":{74:"B",77:"D",79:"C",80:"H",81:"I",82:"A",85:"J",87:"L"},
  "A,B,C,D,H,I,K,L":{74:"A",77:"D",79:"C",80:"K",81:"B",82:"H",85:"I",87:"L"},
  "A,B,C,D,H,J,K,L":{74:"A",77:"D",79:"C",80:"K",81:"B",82:"H",85:"J",87:"L"},
  "A,B,C,D,I,J,K,L":{74:"B",77:"D",79:"C",80:"K",81:"J",82:"A",85:"I",87:"L"},
  "A,B,C,E,F,G,H,I":{74:"B",77:"F",79:"C",80:"H",81:"E",82:"A",85:"G",87:"I"},
  "A,B,C,E,F,G,H,J":{74:"B",77:"F",79:"C",80:"H",81:"J",82:"A",85:"G",87:"E"},
  "A,B,C,E,F,G,H,K":{74:"B",77:"C",79:"H",80:"K",81:"F",82:"A",85:"G",87:"E"},
  "A,B,C,E,F,G,H,L":{74:"B",77:"F",79:"C",80:"H",81:"E",82:"A",85:"G",87:"L"},
  "A,B,C,E,F,G,I,J":{74:"B",77:"F",79:"C",80:"I",81:"J",82:"A",85:"G",87:"E"},
  "A,B,C,E,F,G,I,K":{74:"B",77:"F",79:"C",80:"K",81:"E",82:"A",85:"G",87:"I"},
  "A,B,C,E,F,G,I,L":{74:"B",77:"F",79:"C",80:"E",81:"I",82:"A",85:"G",87:"L"},
  "A,B,C,E,F,G,J,K":{74:"B",77:"F",79:"C",80:"K",81:"J",82:"A",85:"G",87:"E"},
  "A,B,C,E,F,G,J,L":{74:"B",77:"F",79:"C",80:"J",81:"E",82:"A",85:"G",87:"L"},
  "A,B,C,E,F,G,K,L":{74:"B",77:"F",79:"C",80:"K",81:"E",82:"A",85:"G",87:"L"},
  "A,B,C,E,F,H,I,J":{74:"B",77:"F",79:"C",80:"H",81:"I",82:"A",85:"J",87:"E"},
  "A,B,C,E,F,H,I,K":{74:"B",77:"C",79:"H",80:"K",81:"F",82:"A",85:"E",87:"I"},
  "A,B,C,E,F,H,I,L":{74:"B",77:"F",79:"C",80:"H",81:"E",82:"A",85:"I",87:"L"},
  "A,B,C,E,F,H,J,K":{74:"B",77:"C",79:"H",80:"K",81:"F",82:"A",85:"J",87:"E"},
  "A,B,C,E,F,H,J,L":{74:"B",77:"F",79:"C",80:"H",81:"J",82:"A",85:"E",87:"L"},
  "A,B,C,E,F,H,K,L":{74:"B",77:"C",79:"H",80:"K",81:"F",82:"A",85:"E",87:"L"},
  "A,B,C,E,F,I,J,K":{74:"B",77:"F",79:"C",80:"K",81:"I",82:"A",85:"J",87:"E"},
  "A,B,C,E,F,I,J,L":{74:"B",77:"F",79:"C",80:"I",81:"J",82:"A",85:"E",87:"L"},
  "A,B,C,E,F,I,K,L":{74:"B",77:"F",79:"C",80:"K",81:"E",82:"A",85:"I",87:"L"},
  "A,B,C,E,F,J,K,L":{74:"B",77:"F",79:"C",80:"K",81:"J",82:"A",85:"E",87:"L"},
  "A,B,C,E,G,H,I,J":{74:"B",77:"G",79:"C",80:"H",81:"I",82:"A",85:"J",87:"E"},
  "A,B,C,E,G,H,I,K":{74:"B",77:"C",79:"H",80:"K",81:"E",82:"A",85:"G",87:"I"},
  "A,B,C,E,G,H,I,L":{74:"B",77:"G",79:"C",80:"H",81:"E",82:"A",85:"I",87:"L"},
  "A,B,C,E,G,H,J,K":{74:"B",77:"C",79:"H",80:"K",81:"J",82:"A",85:"G",87:"E"},
  "A,B,C,E,G,H,J,L":{74:"B",77:"G",79:"C",80:"H",81:"J",82:"A",85:"E",87:"L"},
  "A,B,C,E,G,H,K,L":{74:"B",77:"C",79:"H",80:"K",81:"E",82:"A",85:"G",87:"L"},
  "A,B,C,E,G,I,J,K":{74:"B",77:"G",79:"C",80:"K",81:"I",82:"A",85:"J",87:"E"},
  "A,B,C,E,G,I,J,L":{74:"B",77:"G",79:"C",80:"I",81:"J",82:"A",85:"E",87:"L"},
  "A,B,C,E,G,I,K,L":{74:"B",77:"G",79:"C",80:"K",81:"E",82:"A",85:"I",87:"L"},
  "A,B,C,E,G,J,K,L":{74:"B",77:"G",79:"C",80:"K",81:"J",82:"A",85:"E",87:"L"},
  "A,B,C,E,H,I,J,K":{74:"B",77:"C",79:"H",80:"K",81:"I",82:"A",85:"J",87:"E"},
  "A,B,C,E,H,I,J,L":{74:"B",77:"C",79:"E",80:"H",81:"I",82:"A",85:"J",87:"L"},
  "A,B,C,E,H,I,K,L":{74:"B",77:"C",79:"H",80:"K",81:"E",82:"A",85:"I",87:"L"},
  "A,B,C,E,H,J,K,L":{74:"B",77:"C",79:"H",80:"K",81:"J",82:"A",85:"E",87:"L"},
  "A,B,C,E,I,J,K,L":{74:"B",77:"C",79:"E",80:"K",81:"J",82:"A",85:"I",87:"L"},
  "A,B,C,F,G,H,I,J":{74:"B",77:"F",79:"C",80:"H",81:"I",82:"A",85:"G",87:"J"},
  "A,B,C,F,G,H,I,K":{74:"B",77:"C",79:"H",80:"K",81:"F",82:"A",85:"G",87:"I"},
  "A,B,C,F,G,H,I,L":{74:"B",77:"F",79:"C",80:"H",81:"I",82:"A",85:"G",87:"L"},
  "A,B,C,F,G,H,J,K":{74:"B",77:"C",79:"H",80:"K",81:"F",82:"A",85:"G",87:"J"},
  "A,B,C,F,G,H,J,L":{74:"B",77:"F",79:"C",80:"H",81:"J",82:"A",85:"G",87:"L"},
  "A,B,C,F,G,H,K,L":{74:"B",77:"C",79:"H",80:"K",81:"F",82:"A",85:"G",87:"L"},
  "A,B,C,F,G,I,J,K":{74:"B",77:"F",79:"C",80:"K",81:"J",82:"A",85:"G",87:"I"},
  "A,B,C,F,G,I,J,L":{74:"B",77:"F",79:"C",80:"J",81:"I",82:"A",85:"G",87:"L"},
  "A,B,C,F,G,I,K,L":{74:"B",77:"F",79:"C",80:"K",81:"I",82:"A",85:"G",87:"L"},
  "A,B,C,F,G,J,K,L":{74:"B",77:"F",79:"C",80:"K",81:"J",82:"A",85:"G",87:"L"},
  "A,B,C,F,H,I,J,K":{74:"B",77:"C",79:"H",80:"K",81:"F",82:"A",85:"I",87:"J"},
  "A,B,C,F,H,I,J,L":{74:"B",77:"F",79:"C",80:"H",81:"I",82:"A",85:"J",87:"L"},
  "A,B,C,F,H,I,K,L":{74:"B",77:"C",79:"H",80:"K",81:"F",82:"A",85:"I",87:"L"},
  "A,B,C,F,H,J,K,L":{74:"B",77:"C",79:"H",80:"K",81:"F",82:"A",85:"J",87:"L"},
  "A,B,C,F,I,J,K,L":{74:"B",77:"F",79:"C",80:"K",81:"J",82:"A",85:"I",87:"L"},
  "A,B,C,G,H,I,J,K":{74:"B",77:"C",79:"H",80:"K",81:"I",82:"A",85:"G",87:"J"},
  "A,B,C,G,H,I,J,L":{74:"B",77:"G",79:"C",80:"H",81:"I",82:"A",85:"J",87:"L"},
  "A,B,C,G,H,I,K,L":{74:"B",77:"C",79:"H",80:"K",81:"I",82:"A",85:"G",87:"L"},
  "A,B,C,G,H,J,K,L":{74:"B",77:"C",79:"H",80:"K",81:"J",82:"A",85:"G",87:"L"},
  "A,B,C,G,I,J,K,L":{74:"B",77:"G",79:"C",80:"K",81:"J",82:"A",85:"I",87:"L"},
  "A,B,C,H,I,J,K,L":{74:"B",77:"C",79:"H",80:"K",81:"J",82:"A",85:"I",87:"L"},
  "A,B,D,E,F,G,H,I":{74:"B",77:"F",79:"E",80:"H",81:"I",82:"A",85:"G",87:"D"},
  "A,B,D,E,F,G,H,J":{74:"B",77:"F",79:"E",80:"H",81:"J",82:"A",85:"G",87:"D"},
  "A,B,D,E,F,G,H,K":{74:"B",77:"F",79:"H",80:"K",81:"E",82:"A",85:"G",87:"D"},
  "A,B,D,E,F,G,H,L":{74:"B",77:"D",79:"F",80:"H",81:"E",82:"A",85:"G",87:"L"},
  "A,B,D,E,F,G,I,J":{74:"B",77:"F",79:"E",80:"J",81:"I",82:"A",85:"G",87:"D"},
  "A,B,D,E,F,G,I,K":{74:"B",77:"F",79:"E",80:"K",81:"I",82:"A",85:"G",87:"D"},
  "A,B,D,E,F,G,I,L":{74:"B",77:"D",79:"F",80:"E",81:"I",82:"A",85:"G",87:"L"},
  "A,B,D,E,F,G,J,K":{74:"B",77:"F",79:"E",80:"K",81:"J",82:"A",85:"G",87:"D"},
  "A,B,D,E,F,G,J,L":{74:"B",77:"D",79:"F",80:"J",81:"E",82:"A",85:"G",87:"L"},
  "A,B,D,E,F,G,K,L":{74:"B",77:"D",79:"F",80:"K",81:"E",82:"A",85:"G",87:"L"},
  "A,B,D,E,F,H,I,J":{74:"B",77:"F",79:"E",80:"H",81:"I",82:"A",85:"J",87:"D"},
  "A,B,D,E,F,H,I,K":{74:"B",77:"F",79:"H",80:"K",81:"E",82:"A",85:"I",87:"D"},
  "A,B,D,E,F,H,I,L":{74:"B",77:"D",79:"F",80:"H",81:"E",82:"A",85:"I",87:"L"},
  "A,B,D,E,F,H,J,K":{74:"B",77:"F",79:"H",80:"K",81:"J",82:"A",85:"E",87:"D"},
  "A,B,D,E,F,H,J,L":{74:"B",77:"D",79:"F",80:"H",81:"J",82:"A",85:"E",87:"L"},
  "A,B,D,E,F,H,K,L":{74:"B",77:"D",79:"H",80:"K",81:"F",82:"A",85:"E",87:"L"},
  "A,B,D,E,F,I,J,K":{74:"B",77:"F",79:"E",80:"K",81:"J",82:"A",85:"I",87:"D"},
  "A,B,D,E,F,I,J,L":{74:"B",77:"D",79:"F",80:"I",81:"J",82:"A",85:"E",87:"L"},
  "A,B,D,E,F,I,K,L":{74:"B",77:"D",79:"F",80:"K",81:"E",82:"A",85:"I",87:"L"},
  "A,B,D,E,F,J,K,L":{74:"B",77:"D",79:"F",80:"K",81:"J",82:"A",85:"E",87:"L"},
  "A,B,D,E,G,H,I,J":{74:"B",77:"G",79:"E",80:"H",81:"I",82:"A",85:"J",87:"D"},
  "A,B,D,E,G,H,I,K":{74:"B",77:"G",79:"H",80:"K",81:"E",82:"A",85:"I",87:"D"},
  "A,B,D,E,G,H,I,L":{74:"B",77:"D",79:"E",80:"H",81:"I",82:"A",85:"G",87:"L"},
  "A,B,D,E,G,H,J,K":{74:"B",77:"G",79:"H",80:"K",81:"J",82:"A",85:"E",87:"D"},
  "A,B,D,E,G,H,J,L":{74:"B",77:"D",79:"E",80:"H",81:"J",82:"A",85:"G",87:"L"},
  "A,B,D,E,G,H,K,L":{74:"B",77:"D",79:"H",80:"K",81:"E",82:"A",85:"G",87:"L"},
  "A,B,D,E,G,I,J,K":{74:"B",77:"G",79:"E",80:"K",81:"J",82:"A",85:"I",87:"D"},
  "A,B,D,E,G,I,J,L":{74:"B",77:"D",79:"I",80:"J",81:"E",82:"A",85:"G",87:"L"},
  "A,B,D,E,G,I,K,L":{74:"B",77:"D",79:"E",80:"K",81:"I",82:"A",85:"G",87:"L"},
  "A,B,D,E,G,J,K,L":{74:"B",77:"D",79:"E",80:"K",81:"J",82:"A",85:"G",87:"L"},
  "A,B,D,E,H,I,J,K":{74:"B",77:"D",79:"H",80:"K",81:"I",82:"A",85:"J",87:"E"},
  "A,B,D,E,H,I,J,L":{74:"B",77:"D",79:"E",80:"H",81:"I",82:"A",85:"J",87:"L"},
  "A,B,D,E,H,I,K,L":{74:"B",77:"D",79:"H",80:"K",81:"E",82:"A",85:"I",87:"L"},
  "A,B,D,E,H,J,K,L":{74:"B",77:"D",79:"H",80:"K",81:"J",82:"A",85:"E",87:"L"},
  "A,B,D,E,I,J,K,L":{74:"B",77:"D",79:"E",80:"K",81:"J",82:"A",85:"I",87:"L"},
  "A,B,D,F,G,H,I,J":{74:"B",77:"F",79:"I",80:"H",81:"J",82:"A",85:"G",87:"D"},
  "A,B,D,F,G,H,I,K":{74:"B",77:"F",79:"H",80:"K",81:"I",82:"A",85:"G",87:"D"},
  "A,B,D,F,G,H,I,L":{74:"B",77:"D",79:"F",80:"H",81:"I",82:"A",85:"G",87:"L"},
  "A,B,D,F,G,H,J,K":{74:"B",77:"F",79:"H",80:"K",81:"J",82:"A",85:"G",87:"D"},
  "A,B,D,F,G,H,J,L":{74:"B",77:"D",79:"F",80:"H",81:"J",82:"A",85:"G",87:"L"},
  "A,B,D,F,G,H,K,L":{74:"B",77:"D",79:"H",80:"K",81:"F",82:"A",85:"G",87:"L"},
  "A,B,D,F,G,I,J,K":{74:"B",77:"F",79:"I",80:"K",81:"J",82:"A",85:"G",87:"D"},
  "A,B,D,F,G,I,J,L":{74:"B",77:"D",79:"F",80:"I",81:"J",82:"A",85:"G",87:"L"},
  "A,B,D,F,G,I,K,L":{74:"B",77:"D",79:"F",80:"K",81:"I",82:"A",85:"G",87:"L"},
  "A,B,D,F,G,J,K,L":{74:"B",77:"D",79:"F",80:"K",81:"J",82:"A",85:"G",87:"L"},
  "A,B,D,F,H,I,J,K":{74:"B",77:"F",79:"H",80:"K",81:"J",82:"A",85:"I",87:"D"},
  "A,B,D,F,H,I,J,L":{74:"B",77:"D",79:"F",80:"H",81:"J",82:"A",85:"I",87:"L"},
  "A,B,D,F,H,I,K,L":{74:"B",77:"D",79:"H",80:"K",81:"F",82:"A",85:"I",87:"L"},
  "A,B,D,F,H,J,K,L":{74:"B",77:"D",79:"H",80:"K",81:"F",82:"A",85:"J",87:"L"},
  "A,B,D,F,I,J,K,L":{74:"B",77:"D",79:"F",80:"K",81:"J",82:"A",85:"I",87:"L"},
  "A,B,D,G,H,I,J,K":{74:"B",77:"G",79:"H",80:"K",81:"J",82:"A",85:"I",87:"D"},
  "A,B,D,G,H,I,J,L":{74:"B",77:"D",79:"I",80:"H",81:"J",82:"A",85:"G",87:"L"},
  "A,B,D,G,H,I,K,L":{74:"B",77:"D",79:"H",80:"K",81:"I",82:"A",85:"G",87:"L"},
  "A,B,D,G,H,J,K,L":{74:"B",77:"D",79:"H",80:"K",81:"J",82:"A",85:"G",87:"L"},
  "A,B,D,G,I,J,K,L":{74:"B",77:"D",79:"I",80:"K",81:"J",82:"A",85:"G",87:"L"},
  "A,B,D,H,I,J,K,L":{74:"B",77:"D",79:"H",80:"K",81:"J",82:"A",85:"I",87:"L"},
  "A,B,E,F,G,H,I,J":{74:"B",77:"F",79:"E",80:"H",81:"I",82:"A",85:"G",87:"J"},
  "A,B,E,F,G,H,I,K":{74:"B",77:"F",79:"H",80:"K",81:"E",82:"A",85:"G",87:"I"},
  "A,B,E,F,G,H,I,L":{74:"B",77:"F",79:"E",80:"H",81:"I",82:"A",85:"G",87:"L"},
  "A,B,E,F,G,H,J,K":{74:"B",77:"F",79:"H",80:"K",81:"J",82:"A",85:"G",87:"E"},
  "A,B,E,F,G,H,J,L":{74:"B",77:"F",79:"E",80:"H",81:"J",82:"A",85:"G",87:"L"},
  "A,B,E,F,G,H,K,L":{74:"B",77:"F",79:"H",80:"K",81:"E",82:"A",85:"G",87:"L"},
  "A,B,E,F,G,I,J,K":{74:"B",77:"F",79:"E",80:"K",81:"J",82:"A",85:"G",87:"I"},
  "A,B,E,F,G,I,J,L":{74:"B",77:"F",79:"E",80:"J",81:"I",82:"A",85:"G",87:"L"},
  "A,B,E,F,G,I,K,L":{74:"B",77:"F",79:"E",80:"K",81:"I",82:"A",85:"G",87:"L"},
  "A,B,E,F,G,J,K,L":{74:"B",77:"F",79:"E",80:"K",81:"J",82:"A",85:"G",87:"L"},
  "A,B,E,F,H,I,J,K":{74:"B",77:"F",79:"H",80:"K",81:"I",82:"A",85:"J",87:"E"},
  "A,B,E,F,H,I,J,L":{74:"B",77:"F",79:"E",80:"H",81:"I",82:"A",85:"J",87:"L"},
  "A,B,E,F,H,I,K,L":{74:"B",77:"F",79:"H",80:"K",81:"E",82:"A",85:"I",87:"L"},
  "A,B,E,F,H,J,K,L":{74:"B",77:"F",79:"H",80:"K",81:"J",82:"A",85:"E",87:"L"},
  "A,B,E,F,I,J,K,L":{74:"B",77:"F",79:"E",80:"K",81:"J",82:"A",85:"I",87:"L"},
  "A,B,E,G,H,I,J,K":{74:"B",77:"G",79:"H",80:"K",81:"I",82:"A",85:"J",87:"E"},
  "A,B,E,G,H,I,J,L":{74:"B",77:"G",79:"E",80:"H",81:"I",82:"A",85:"J",87:"L"},
  "A,B,E,G,H,I,K,L":{74:"B",77:"G",79:"H",80:"K",81:"E",82:"A",85:"I",87:"L"},
  "A,B,E,G,H,J,K,L":{74:"B",77:"G",79:"H",80:"K",81:"J",82:"A",85:"E",87:"L"},
  "A,B,E,G,I,J,K,L":{74:"B",77:"G",79:"E",80:"K",81:"J",82:"A",85:"I",87:"L"},
  "A,B,E,H,I,J,K,L":{74:"B",77:"H",79:"E",80:"K",81:"J",82:"A",85:"I",87:"L"},
  "A,B,F,G,H,I,J,K":{74:"B",77:"F",79:"H",80:"K",81:"J",82:"A",85:"G",87:"I"},
  "A,B,F,G,H,I,J,L":{74:"B",77:"F",79:"I",80:"H",81:"J",82:"A",85:"G",87:"L"},
  "A,B,F,G,H,I,K,L":{74:"B",77:"F",79:"H",80:"K",81:"I",82:"A",85:"G",87:"L"},
  "A,B,F,G,H,J,K,L":{74:"B",77:"F",79:"H",80:"K",81:"J",82:"A",85:"G",87:"L"},
  "A,B,F,G,I,J,K,L":{74:"B",77:"F",79:"I",80:"K",81:"J",82:"A",85:"G",87:"L"},
  "A,B,F,H,I,J,K,L":{74:"B",77:"F",79:"H",80:"K",81:"J",82:"A",85:"I",87:"L"},
  "A,B,G,H,I,J,K,L":{74:"B",77:"G",79:"H",80:"K",81:"J",82:"A",85:"I",87:"L"},
  "A,C,D,E,F,G,H,I":{74:"F",77:"G",79:"C",80:"H",81:"E",82:"A",85:"I",87:"D"},
  "A,C,D,E,F,G,H,J":{74:"F",77:"G",79:"C",80:"H",81:"J",82:"A",85:"E",87:"D"},
  "A,C,D,E,F,G,H,K":{74:"F",77:"C",79:"H",80:"K",81:"E",82:"A",85:"G",87:"D"},
  "A,C,D,E,F,G,H,L":{74:"F",77:"D",79:"C",80:"H",81:"E",82:"A",85:"G",87:"L"},
  "A,C,D,E,F,G,I,J":{74:"F",77:"G",79:"C",80:"I",81:"J",82:"A",85:"E",87:"D"},
  "A,C,D,E,F,G,I,K":{74:"F",77:"G",79:"C",80:"K",81:"E",82:"A",85:"I",87:"D"},
  "A,C,D,E,F,G,I,L":{74:"F",77:"D",79:"C",80:"E",81:"I",82:"A",85:"G",87:"L"},
  "A,C,D,E,F,G,J,K":{74:"F",77:"G",79:"C",80:"K",81:"J",82:"A",85:"E",87:"D"},
  "A,C,D,E,F,G,J,L":{74:"F",77:"D",79:"C",80:"J",81:"E",82:"A",85:"G",87:"L"},
  "A,C,D,E,F,G,K,L":{74:"F",77:"D",79:"C",80:"K",81:"E",82:"A",85:"G",87:"L"},
  "A,C,D,E,F,H,I,J":{74:"F",77:"D",79:"C",80:"H",81:"I",82:"A",85:"J",87:"E"},
  "A,C,D,E,F,H,I,K":{74:"F",77:"C",79:"H",80:"K",81:"E",82:"A",85:"I",87:"D"},
  "A,C,D,E,F,H,I,L":{74:"F",77:"D",79:"C",80:"H",81:"E",82:"A",85:"I",87:"L"},
  "A,C,D,E,F,H,J,K":{74:"F",77:"C",79:"H",80:"K",81:"J",82:"A",85:"E",87:"D"},
  "A,C,D,E,F,H,J,L":{74:"F",77:"D",79:"C",80:"H",81:"J",82:"A",85:"E",87:"L"},
  "A,C,D,E,F,H,K,L":{74:"A",77:"D",79:"C",80:"K",81:"F",82:"H",85:"E",87:"L"},
  "A,C,D,E,F,I,J,K":{74:"F",77:"D",79:"C",80:"K",81:"I",82:"A",85:"J",87:"E"},
  "A,C,D,E,F,I,J,L":{74:"F",77:"D",79:"C",80:"I",81:"J",82:"A",85:"E",87:"L"},
  "A,C,D,E,F,I,K,L":{74:"F",77:"D",79:"C",80:"K",81:"E",82:"A",85:"I",87:"L"},
  "A,C,D,E,F,J,K,L":{74:"F",77:"D",79:"C",80:"K",81:"J",82:"A",85:"E",87:"L"},
  "A,C,D,E,G,H,I,J":{74:"A",77:"G",79:"C",80:"I",81:"J",82:"H",85:"E",87:"D"},
  "A,C,D,E,G,H,I,K":{74:"A",77:"G",79:"C",80:"K",81:"E",82:"H",85:"I",87:"D"},
  "A,C,D,E,G,H,I,L":{74:"A",77:"D",79:"C",80:"E",81:"I",82:"H",85:"G",87:"L"},
  "A,C,D,E,G,H,J,K":{74:"A",77:"G",79:"C",80:"K",81:"J",82:"H",85:"E",87:"D"},
  "A,C,D,E,G,H,J,L":{74:"A",77:"D",79:"C",80:"J",81:"E",82:"H",85:"G",87:"L"},
  "A,C,D,E,G,H,K,L":{74:"A",77:"D",79:"C",80:"K",81:"E",82:"H",85:"G",87:"L"},
  "A,C,D,E,G,I,J,K":{74:"A",77:"G",79:"C",80:"K",81:"I",82:"J",85:"E",87:"D"},
  "A,C,D,E,G,I,J,L":{74:"A",77:"D",79:"C",80:"I",81:"J",82:"E",85:"G",87:"L"},
  "A,C,D,E,G,I,K,L":{74:"A",77:"D",79:"C",80:"K",81:"E",82:"I",85:"G",87:"L"},
  "A,C,D,E,G,J,K,L":{74:"A",77:"D",79:"C",80:"K",81:"J",82:"E",85:"G",87:"L"},
  "A,C,D,E,H,I,J,K":{74:"A",77:"D",79:"C",80:"K",81:"I",82:"H",85:"J",87:"E"},
  "A,C,D,E,H,I,J,L":{74:"A",77:"D",79:"C",80:"I",81:"J",82:"H",85:"E",87:"L"},
  "A,C,D,E,H,I,K,L":{74:"A",77:"D",79:"C",80:"K",81:"E",82:"H",85:"I",87:"L"},
  "A,C,D,E,H,J,K,L":{74:"A",77:"D",79:"C",80:"K",81:"J",82:"H",85:"E",87:"L"},
  "A,C,D,E,I,J,K,L":{74:"A",77:"D",79:"C",80:"K",81:"I",82:"J",85:"E",87:"L"},
  "A,C,D,F,G,H,I,J":{74:"F",77:"G",79:"C",80:"H",81:"I",82:"A",85:"J",87:"D"},
  "A,C,D,F,G,H,I,K":{74:"F",77:"C",79:"H",80:"K",81:"I",82:"A",85:"G",87:"D"},
  "A,C,D,F,G,H,I,L":{74:"F",77:"D",79:"C",80:"H",81:"I",82:"A",85:"G",87:"L"},
  "A,C,D,F,G,H,J,K":{74:"F",77:"C",79:"H",80:"K",81:"J",82:"A",85:"G",87:"D"},
  "A,C,D,F,G,H,J,L":{74:"F",77:"D",79:"C",80:"H",81:"J",82:"A",85:"G",87:"L"},
  "A,C,D,F,G,H,K,L":{74:"A",77:"D",79:"C",80:"K",81:"F",82:"H",85:"G",87:"L"},
  "A,C,D,F,G,I,J,K":{74:"F",77:"G",79:"C",80:"K",81:"J",82:"A",85:"I",87:"D"},
  "A,C,D,F,G,I,J,L":{74:"F",77:"D",79:"C",80:"I",81:"J",82:"A",85:"G",87:"L"},
  "A,C,D,F,G,I,K,L":{74:"F",77:"D",79:"C",80:"K",81:"I",82:"A",85:"G",87:"L"},
  "A,C,D,F,G,J,K,L":{74:"F",77:"D",79:"C",80:"K",81:"J",82:"A",85:"G",87:"L"},
  "A,C,D,F,H,I,J,K":{74:"F",77:"C",79:"H",80:"K",81:"I",82:"A",85:"J",87:"D"},
  "A,C,D,F,H,I,J,L":{74:"F",77:"D",79:"C",80:"H",81:"I",82:"A",85:"J",87:"L"},
  "A,C,D,F,H,I,K,L":{74:"A",77:"D",79:"C",80:"K",81:"F",82:"H",85:"I",87:"L"},
  "A,C,D,F,H,J,K,L":{74:"A",77:"D",79:"C",80:"K",81:"F",82:"H",85:"J",87:"L"},
  "A,C,D,F,I,J,K,L":{74:"F",77:"D",79:"C",80:"K",81:"J",82:"A",85:"I",87:"L"},
  "A,C,D,G,H,I,J,K":{74:"A",77:"G",79:"C",80:"K",81:"J",82:"H",85:"I",87:"D"},
  "A,C,D,G,H,I,J,L":{74:"A",77:"D",79:"C",80:"I",81:"J",82:"H",85:"G",87:"L"},
  "A,C,D,G,H,I,K,L":{74:"A",77:"D",79:"C",80:"K",81:"I",82:"H",85:"G",87:"L"},
  "A,C,D,G,H,J,K,L":{74:"A",77:"D",79:"C",80:"K",81:"J",82:"H",85:"G",87:"L"},
  "A,C,D,G,I,J,K,L":{74:"A",77:"D",79:"C",80:"K",81:"I",82:"J",85:"G",87:"L"},
  "A,C,D,H,I,J,K,L":{74:"A",77:"D",79:"C",80:"K",81:"J",82:"H",85:"I",87:"L"},
  "A,C,E,F,G,H,I,J":{74:"F",77:"G",79:"C",80:"H",81:"I",82:"A",85:"J",87:"E"},
  "A,C,E,F,G,H,I,K":{74:"F",77:"C",79:"H",80:"K",81:"E",82:"A",85:"G",87:"I"},
  "A,C,E,F,G,H,I,L":{74:"F",77:"G",79:"C",80:"H",81:"E",82:"A",85:"I",87:"L"},
  "A,C,E,F,G,H,J,K":{74:"F",77:"C",79:"H",80:"K",81:"J",82:"A",85:"G",87:"E"},
  "A,C,E,F,G,H,J,L":{74:"F",77:"G",79:"C",80:"H",81:"J",82:"A",85:"E",87:"L"},
  "A,C,E,F,G,H,K,L":{74:"F",77:"C",79:"H",80:"K",81:"E",82:"A",85:"G",87:"L"},
  "A,C,E,F,G,I,J,K":{74:"F",77:"G",79:"C",80:"K",81:"I",82:"A",85:"J",87:"E"},
  "A,C,E,F,G,I,J,L":{74:"F",77:"G",79:"C",80:"I",81:"J",82:"A",85:"E",87:"L"},
  "A,C,E,F,G,I,K,L":{74:"F",77:"G",79:"C",80:"K",81:"E",82:"A",85:"I",87:"L"},
  "A,C,E,F,G,J,K,L":{74:"F",77:"G",79:"C",80:"K",81:"J",82:"A",85:"E",87:"L"},
  "A,C,E,F,H,I,J,K":{74:"F",77:"C",79:"H",80:"K",81:"I",82:"A",85:"J",87:"E"},
  "A,C,E,F,H,I,J,L":{74:"F",77:"C",79:"E",80:"H",81:"I",82:"A",85:"J",87:"L"},
  "A,C,E,F,H,I,K,L":{74:"F",77:"C",79:"H",80:"K",81:"E",82:"A",85:"I",87:"L"},
  "A,C,E,F,H,J,K,L":{74:"F",77:"C",79:"H",80:"K",81:"J",82:"A",85:"E",87:"L"},
  "A,C,E,F,I,J,K,L":{74:"F",77:"C",79:"E",80:"K",81:"J",82:"A",85:"I",87:"L"},
  "A,C,E,G,H,I,J,K":{74:"A",77:"G",79:"C",80:"K",81:"I",82:"H",85:"J",87:"E"},
  "A,C,E,G,H,I,J,L":{74:"A",77:"G",79:"C",80:"I",81:"J",82:"H",85:"E",87:"L"},
  "A,C,E,G,H,I,K,L":{74:"A",77:"G",79:"C",80:"K",81:"E",82:"H",85:"I",87:"L"},
  "A,C,E,G,H,J,K,L":{74:"A",77:"G",79:"C",80:"K",81:"J",82:"H",85:"E",87:"L"},
  "A,C,E,G,I,J,K,L":{74:"A",77:"G",79:"C",80:"K",81:"I",82:"J",85:"E",87:"L"},
  "A,C,E,H,I,J,K,L":{74:"A",77:"C",79:"E",80:"K",81:"J",82:"H",85:"I",87:"L"},
  "A,C,F,G,H,I,J,K":{74:"F",77:"C",79:"H",80:"K",81:"I",82:"A",85:"G",87:"J"},
  "A,C,F,G,H,I,J,L":{74:"F",77:"G",79:"C",80:"H",81:"I",82:"A",85:"J",87:"L"},
  "A,C,F,G,H,I,K,L":{74:"F",77:"C",79:"H",80:"K",81:"I",82:"A",85:"G",87:"L"},
  "A,C,F,G,H,J,K,L":{74:"F",77:"C",79:"H",80:"K",81:"J",82:"A",85:"G",87:"L"},
  "A,C,F,G,I,J,K,L":{74:"F",77:"G",79:"C",80:"K",81:"J",82:"A",85:"I",87:"L"},
  "A,C,F,H,I,J,K,L":{74:"F",77:"C",79:"H",80:"K",81:"J",82:"A",85:"I",87:"L"},
  "A,C,G,H,I,J,K,L":{74:"A",77:"G",79:"C",80:"K",81:"J",82:"H",85:"I",87:"L"},
  "A,D,E,F,G,H,I,J":{74:"F",77:"G",79:"E",80:"H",81:"I",82:"A",85:"J",87:"D"},
  "A,D,E,F,G,H,I,K":{74:"F",77:"G",79:"H",80:"K",81:"E",82:"A",85:"I",87:"D"},
  "A,D,E,F,G,H,I,L":{74:"F",77:"D",79:"E",80:"H",81:"I",82:"A",85:"G",87:"L"},
  "A,D,E,F,G,H,J,K":{74:"F",77:"G",79:"H",80:"K",81:"J",82:"A",85:"E",87:"D"},
  "A,D,E,F,G,H,J,L":{74:"F",77:"D",79:"E",80:"H",81:"J",82:"A",85:"G",87:"L"},
  "A,D,E,F,G,H,K,L":{74:"F",77:"D",79:"H",80:"K",81:"E",82:"A",85:"G",87:"L"},
  "A,D,E,F,G,I,J,K":{74:"F",77:"G",79:"E",80:"K",81:"J",82:"A",85:"I",87:"D"},
  "A,D,E,F,G,I,J,L":{74:"F",77:"D",79:"I",80:"J",81:"E",82:"A",85:"G",87:"L"},
  "A,D,E,F,G,I,K,L":{74:"F",77:"D",79:"E",80:"K",81:"I",82:"A",85:"G",87:"L"},
  "A,D,E,F,G,J,K,L":{74:"F",77:"D",79:"E",80:"K",81:"J",82:"A",85:"G",87:"L"},
  "A,D,E,F,H,I,J,K":{74:"F",77:"D",79:"H",80:"K",81:"I",82:"A",85:"J",87:"E"},
  "A,D,E,F,H,I,J,L":{74:"F",77:"D",79:"E",80:"H",81:"I",82:"A",85:"J",87:"L"},
  "A,D,E,F,H,I,K,L":{74:"F",77:"D",79:"H",80:"K",81:"E",82:"A",85:"I",87:"L"},
  "A,D,E,F,H,J,K,L":{74:"F",77:"D",79:"H",80:"K",81:"J",82:"A",85:"E",87:"L"},
  "A,D,E,F,I,J,K,L":{74:"F",77:"D",79:"E",80:"K",81:"J",82:"A",85:"I",87:"L"},
  "A,D,E,G,H,I,J,K":{74:"A",77:"G",79:"E",80:"K",81:"J",82:"H",85:"I",87:"D"},
  "A,D,E,G,H,I,J,L":{74:"A",77:"D",79:"I",80:"J",81:"E",82:"H",85:"G",87:"L"},
  "A,D,E,G,H,I,K,L":{74:"A",77:"D",79:"E",80:"K",81:"I",82:"H",85:"G",87:"L"},
  "A,D,E,G,H,J,K,L":{74:"A",77:"D",79:"E",80:"K",81:"J",82:"H",85:"G",87:"L"},
  "A,D,E,G,I,J,K,L":{74:"A",77:"D",79:"I",80:"K",81:"J",82:"E",85:"G",87:"L"},
  "A,D,E,H,I,J,K,L":{74:"A",77:"D",79:"E",80:"K",81:"J",82:"H",85:"I",87:"L"},
  "A,D,F,G,H,I,J,K":{74:"F",77:"G",79:"H",80:"K",81:"J",82:"A",85:"I",87:"D"},
  "A,D,F,G,H,I,J,L":{74:"F",77:"D",79:"I",80:"H",81:"J",82:"A",85:"G",87:"L"},
  "A,D,F,G,H,I,K,L":{74:"F",77:"D",79:"H",80:"K",81:"I",82:"A",85:"G",87:"L"},
  "A,D,F,G,H,J,K,L":{74:"F",77:"D",79:"H",80:"K",81:"J",82:"A",85:"G",87:"L"},
  "A,D,F,G,I,J,K,L":{74:"F",77:"D",79:"I",80:"K",81:"J",82:"A",85:"G",87:"L"},
  "A,D,F,H,I,J,K,L":{74:"F",77:"D",79:"H",80:"K",81:"J",82:"A",85:"I",87:"L"},
  "A,D,G,H,I,J,K,L":{74:"A",77:"D",79:"I",80:"K",81:"J",82:"H",85:"G",87:"L"},
  "A,E,F,G,H,I,J,K":{74:"F",77:"G",79:"H",80:"K",81:"I",82:"A",85:"J",87:"E"},
  "A,E,F,G,H,I,J,L":{74:"F",77:"G",79:"E",80:"H",81:"I",82:"A",85:"J",87:"L"},
  "A,E,F,G,H,I,K,L":{74:"F",77:"G",79:"H",80:"K",81:"E",82:"A",85:"I",87:"L"},
  "A,E,F,G,H,J,K,L":{74:"F",77:"G",79:"H",80:"K",81:"J",82:"A",85:"E",87:"L"},
  "A,E,F,G,I,J,K,L":{74:"F",77:"G",79:"E",80:"K",81:"J",82:"A",85:"I",87:"L"},
  "A,E,F,H,I,J,K,L":{74:"F",77:"H",79:"E",80:"K",81:"J",82:"A",85:"I",87:"L"},
  "A,E,G,H,I,J,K,L":{74:"A",77:"G",79:"E",80:"K",81:"J",82:"H",85:"I",87:"L"},
  "A,F,G,H,I,J,K,L":{74:"F",77:"G",79:"H",80:"K",81:"J",82:"A",85:"I",87:"L"},
  "B,C,D,E,F,G,H,I":{74:"B",77:"F",79:"C",80:"E",81:"I",82:"H",85:"G",87:"D"},
  "B,C,D,E,F,G,H,J":{74:"B",77:"F",79:"C",80:"J",81:"E",82:"H",85:"G",87:"D"},
  "B,C,D,E,F,G,H,K":{74:"B",77:"F",79:"C",80:"K",81:"E",82:"H",85:"G",87:"D"},
  "B,C,D,E,F,G,H,L":{74:"B",77:"D",79:"C",80:"E",81:"F",82:"H",85:"G",87:"L"},
  "B,C,D,E,F,G,I,J":{74:"B",77:"F",79:"C",80:"I",81:"J",82:"E",85:"G",87:"D"},
  "B,C,D,E,F,G,I,K":{74:"B",77:"F",79:"C",80:"K",81:"E",82:"I",85:"G",87:"D"},
  "B,C,D,E,F,G,I,L":{74:"B",77:"D",79:"C",80:"E",81:"F",82:"I",85:"G",87:"L"},
  "B,C,D,E,F,G,J,K":{74:"B",77:"F",79:"C",80:"K",81:"J",82:"E",85:"G",87:"D"},
  "B,C,D,E,F,G,J,L":{74:"B",77:"D",79:"C",80:"J",81:"F",82:"E",85:"G",87:"L"},
  "B,C,D,E,F,G,K,L":{74:"B",77:"D",79:"C",80:"K",81:"F",82:"E",85:"G",87:"L"},
  "B,C,D,E,F,H,I,J":{74:"B",77:"F",79:"C",80:"I",81:"J",82:"H",85:"E",87:"D"},
  "B,C,D,E,F,H,I,K":{74:"B",77:"F",79:"C",80:"K",81:"E",82:"H",85:"I",87:"D"},
  "B,C,D,E,F,H,I,L":{74:"B",77:"D",79:"C",80:"E",81:"F",82:"H",85:"I",87:"L"},
  "B,C,D,E,F,H,J,K":{74:"B",77:"F",79:"C",80:"K",81:"J",82:"H",85:"E",87:"D"},
  "B,C,D,E,F,H,J,L":{74:"B",77:"D",79:"C",80:"J",81:"F",82:"H",85:"E",87:"L"},
  "B,C,D,E,F,H,K,L":{74:"B",77:"D",79:"C",80:"K",81:"F",82:"H",85:"E",87:"L"},
  "B,C,D,E,F,I,J,K":{74:"B",77:"F",79:"C",80:"K",81:"I",82:"J",85:"E",87:"D"},
  "B,C,D,E,F,I,J,L":{74:"B",77:"D",79:"C",80:"J",81:"F",82:"I",85:"E",87:"L"},
  "B,C,D,E,F,I,K,L":{74:"B",77:"D",79:"C",80:"K",81:"F",82:"E",85:"I",87:"L"},
  "B,C,D,E,F,J,K,L":{74:"B",77:"D",79:"C",80:"K",81:"F",82:"J",85:"E",87:"L"},
  "B,C,D,E,G,H,I,J":{74:"B",77:"G",79:"C",80:"I",81:"J",82:"H",85:"E",87:"D"},
  "B,C,D,E,G,H,I,K":{74:"B",77:"G",79:"C",80:"K",81:"E",82:"H",85:"I",87:"D"},
  "B,C,D,E,G,H,I,L":{74:"B",77:"D",79:"C",80:"E",81:"I",82:"H",85:"G",87:"L"},
  "B,C,D,E,G,H,J,K":{74:"B",77:"G",79:"C",80:"K",81:"J",82:"H",85:"E",87:"D"},
  "B,C,D,E,G,H,J,L":{74:"B",77:"D",79:"C",80:"J",81:"E",82:"H",85:"G",87:"L"},
  "B,C,D,E,G,H,K,L":{74:"B",77:"D",79:"C",80:"K",81:"E",82:"H",85:"G",87:"L"},
  "B,C,D,E,G,I,J,K":{74:"B",77:"G",79:"C",80:"K",81:"I",82:"J",85:"E",87:"D"},
  "B,C,D,E,G,I,J,L":{74:"B",77:"D",79:"C",80:"I",81:"J",82:"E",85:"G",87:"L"},
  "B,C,D,E,G,I,K,L":{74:"B",77:"D",79:"C",80:"K",81:"E",82:"I",85:"G",87:"L"},
  "B,C,D,E,G,J,K,L":{74:"B",77:"D",79:"C",80:"K",81:"J",82:"E",85:"G",87:"L"},
  "B,C,D,E,H,I,J,K":{74:"B",77:"D",79:"C",80:"K",81:"I",82:"H",85:"J",87:"E"},
  "B,C,D,E,H,I,J,L":{74:"B",77:"D",79:"C",80:"I",81:"J",82:"H",85:"E",87:"L"},
  "B,C,D,E,H,I,K,L":{74:"B",77:"D",79:"C",80:"K",81:"E",82:"H",85:"I",87:"L"},
  "B,C,D,E,H,J,K,L":{74:"B",77:"D",79:"C",80:"K",81:"J",82:"H",85:"E",87:"L"},
  "B,C,D,E,I,J,K,L":{74:"B",77:"D",79:"C",80:"K",81:"I",82:"J",85:"E",87:"L"},
  "B,C,D,F,G,H,I,J":{74:"B",77:"F",79:"C",80:"J",81:"I",82:"H",85:"G",87:"D"},
  "B,C,D,F,G,H,I,K":{74:"B",77:"F",79:"C",80:"K",81:"I",82:"H",85:"G",87:"D"},
  "B,C,D,F,G,H,I,L":{74:"B",77:"D",79:"C",80:"I",81:"F",82:"H",85:"G",87:"L"},
  "B,C,D,F,G,H,J,K":{74:"B",77:"F",79:"C",80:"K",81:"J",82:"H",85:"G",87:"D"},
  "B,C,D,F,G,H,J,L":{74:"B",77:"D",79:"C",80:"J",81:"F",82:"H",85:"G",87:"L"},
  "B,C,D,F,G,H,K,L":{74:"B",77:"D",79:"C",80:"K",81:"F",82:"H",85:"G",87:"L"},
  "B,C,D,F,G,I,J,K":{74:"B",77:"F",79:"C",80:"K",81:"J",82:"I",85:"G",87:"D"},
  "B,C,D,F,G,I,J,L":{74:"B",77:"D",79:"C",80:"I",81:"F",82:"J",85:"G",87:"L"},
  "B,C,D,F,G,I,K,L":{74:"B",77:"D",79:"C",80:"K",81:"F",82:"I",85:"G",87:"L"},
  "B,C,D,F,G,J,K,L":{74:"B",77:"D",79:"C",80:"K",81:"F",82:"J",85:"G",87:"L"},
  "B,C,D,F,H,I,J,K":{74:"B",77:"F",79:"C",80:"K",81:"J",82:"H",85:"I",87:"D"},
  "B,C,D,F,H,I,J,L":{74:"B",77:"D",79:"C",80:"I",81:"F",82:"H",85:"J",87:"L"},
  "B,C,D,F,H,I,K,L":{74:"B",77:"D",79:"C",80:"K",81:"F",82:"H",85:"I",87:"L"},
  "B,C,D,F,H,J,K,L":{74:"B",77:"D",79:"C",80:"K",81:"F",82:"H",85:"J",87:"L"},
  "B,C,D,F,I,J,K,L":{74:"B",77:"D",79:"C",80:"K",81:"F",82:"J",85:"I",87:"L"},
  "B,C,D,G,H,I,J,K":{74:"B",77:"G",79:"C",80:"K",81:"J",82:"H",85:"I",87:"D"},
  "B,C,D,G,H,I,J,L":{74:"B",77:"D",79:"C",80:"I",81:"J",82:"H",85:"G",87:"L"},
  "B,C,D,G,H,I,K,L":{74:"B",77:"D",79:"C",80:"K",81:"I",82:"H",85:"G",87:"L"},
  "B,C,D,G,H,J,K,L":{74:"B",77:"D",79:"C",80:"K",81:"J",82:"H",85:"G",87:"L"},
  "B,C,D,G,I,J,K,L":{74:"B",77:"D",79:"C",80:"K",81:"I",82:"J",85:"G",87:"L"},
  "B,C,D,H,I,J,K,L":{74:"B",77:"D",79:"C",80:"K",81:"J",82:"H",85:"I",87:"L"},
  "B,C,E,F,G,H,I,J":{74:"B",77:"F",79:"C",80:"I",81:"J",82:"H",85:"G",87:"E"},
  "B,C,E,F,G,H,I,K":{74:"B",77:"F",79:"C",80:"K",81:"E",82:"H",85:"G",87:"I"},
  "B,C,E,F,G,H,I,L":{74:"B",77:"F",79:"C",80:"E",81:"I",82:"H",85:"G",87:"L"},
  "B,C,E,F,G,H,J,K":{74:"B",77:"F",79:"C",80:"K",81:"J",82:"H",85:"G",87:"E"},
  "B,C,E,F,G,H,J,L":{74:"B",77:"F",79:"C",80:"J",81:"E",82:"H",85:"G",87:"L"},
  "B,C,E,F,G,H,K,L":{74:"B",77:"F",79:"C",80:"K",81:"E",82:"H",85:"G",87:"L"},
  "B,C,E,F,G,I,J,K":{74:"B",77:"F",79:"C",80:"K",81:"I",82:"J",85:"G",87:"E"},
  "B,C,E,F,G,I,J,L":{74:"B",77:"F",79:"C",80:"I",81:"J",82:"E",85:"G",87:"L"},
  "B,C,E,F,G,I,K,L":{74:"B",77:"F",79:"C",80:"K",81:"E",82:"I",85:"G",87:"L"},
  "B,C,E,F,G,J,K,L":{74:"B",77:"F",79:"C",80:"K",81:"J",82:"E",85:"G",87:"L"},
  "B,C,E,F,H,I,J,K":{74:"B",77:"F",79:"C",80:"K",81:"I",82:"H",85:"J",87:"E"},
  "B,C,E,F,H,I,J,L":{74:"B",77:"F",79:"C",80:"I",81:"J",82:"H",85:"E",87:"L"},
  "B,C,E,F,H,I,K,L":{74:"B",77:"F",79:"C",80:"K",81:"E",82:"H",85:"I",87:"L"},
  "B,C,E,F,H,J,K,L":{74:"B",77:"F",79:"C",80:"K",81:"J",82:"H",85:"E",87:"L"},
  "B,C,E,F,I,J,K,L":{74:"B",77:"F",79:"C",80:"K",81:"I",82:"J",85:"E",87:"L"},
  "B,C,E,G,H,I,J,K":{74:"B",77:"G",79:"C",80:"K",81:"I",82:"H",85:"J",87:"E"},
  "B,C,E,G,H,I,J,L":{74:"B",77:"G",79:"C",80:"I",81:"J",82:"H",85:"E",87:"L"},
  "B,C,E,G,H,I,K,L":{74:"B",77:"G",79:"C",80:"K",81:"E",82:"H",85:"I",87:"L"},
  "B,C,E,G,H,J,K,L":{74:"B",77:"G",79:"C",80:"K",81:"J",82:"H",85:"E",87:"L"},
  "B,C,E,G,I,J,K,L":{74:"B",77:"G",79:"C",80:"K",81:"I",82:"J",85:"E",87:"L"},
  "B,C,E,H,I,J,K,L":{74:"B",77:"C",79:"E",80:"K",81:"J",82:"H",85:"I",87:"L"},
  "B,C,F,G,H,I,J,K":{74:"B",77:"F",79:"C",80:"K",81:"J",82:"H",85:"G",87:"I"},
  "B,C,F,G,H,I,J,L":{74:"B",77:"F",79:"C",80:"J",81:"I",82:"H",85:"G",87:"L"},
  "B,C,F,G,H,I,K,L":{74:"B",77:"F",79:"C",80:"K",81:"I",82:"H",85:"G",87:"L"},
  "B,C,F,G,H,J,K,L":{74:"B",77:"F",79:"C",80:"K",81:"J",82:"H",85:"G",87:"L"},
  "B,C,F,G,I,J,K,L":{74:"B",77:"F",79:"C",80:"K",81:"J",82:"I",85:"G",87:"L"},
  "B,C,F,H,I,J,K,L":{74:"B",77:"F",79:"C",80:"K",81:"J",82:"H",85:"I",87:"L"},
  "B,C,G,H,I,J,K,L":{74:"B",77:"G",79:"C",80:"K",81:"J",82:"H",85:"I",87:"L"},
  "B,D,E,F,G,H,I,J":{74:"B",77:"F",79:"E",80:"J",81:"I",82:"H",85:"G",87:"D"},
  "B,D,E,F,G,H,I,K":{74:"B",77:"F",79:"E",80:"K",81:"I",82:"H",85:"G",87:"D"},
  "B,D,E,F,G,H,I,L":{74:"B",77:"D",79:"F",80:"E",81:"I",82:"H",85:"G",87:"L"},
  "B,D,E,F,G,H,J,K":{74:"B",77:"F",79:"E",80:"K",81:"J",82:"H",85:"G",87:"D"},
  "B,D,E,F,G,H,J,L":{74:"B",77:"D",79:"F",80:"J",81:"E",82:"H",85:"G",87:"L"},
  "B,D,E,F,G,H,K,L":{74:"B",77:"D",79:"F",80:"K",81:"E",82:"H",85:"G",87:"L"},
  "B,D,E,F,G,I,J,K":{74:"B",77:"F",79:"E",80:"K",81:"J",82:"I",85:"G",87:"D"},
  "B,D,E,F,G,I,J,L":{74:"B",77:"D",79:"F",80:"J",81:"I",82:"E",85:"G",87:"L"},
  "B,D,E,F,G,I,K,L":{74:"B",77:"D",79:"F",80:"K",81:"E",82:"I",85:"G",87:"L"},
  "B,D,E,F,G,J,K,L":{74:"B",77:"D",79:"F",80:"K",81:"J",82:"E",85:"G",87:"L"},
  "B,D,E,F,H,I,J,K":{74:"B",77:"F",79:"E",80:"K",81:"J",82:"H",85:"I",87:"D"},
  "B,D,E,F,H,I,J,L":{74:"B",77:"D",79:"F",80:"I",81:"J",82:"H",85:"E",87:"L"},
  "B,D,E,F,H,I,K,L":{74:"B",77:"D",79:"F",80:"K",81:"E",82:"H",85:"I",87:"L"},
  "B,D,E,F,H,J,K,L":{74:"B",77:"D",79:"F",80:"K",81:"J",82:"H",85:"E",87:"L"},
  "B,D,E,F,I,J,K,L":{74:"B",77:"D",79:"F",80:"K",81:"I",82:"J",85:"E",87:"L"},
  "B,D,E,G,H,I,J,K":{74:"B",77:"G",79:"E",80:"K",81:"J",82:"H",85:"I",87:"D"},
  "B,D,E,G,H,I,J,L":{74:"B",77:"D",79:"I",80:"J",81:"E",82:"H",85:"G",87:"L"},
  "B,D,E,G,H,I,K,L":{74:"B",77:"D",79:"E",80:"K",81:"I",82:"H",85:"G",87:"L"},
  "B,D,E,G,H,J,K,L":{74:"B",77:"D",79:"E",80:"K",81:"J",82:"H",85:"G",87:"L"},
  "B,D,E,G,I,J,K,L":{74:"B",77:"D",79:"I",80:"K",81:"J",82:"E",85:"G",87:"L"},
  "B,D,E,H,I,J,K,L":{74:"B",77:"D",79:"E",80:"K",81:"J",82:"H",85:"I",87:"L"},
  "B,D,F,G,H,I,J,K":{74:"B",77:"F",79:"I",80:"K",81:"J",82:"H",85:"G",87:"D"},
  "B,D,F,G,H,I,J,L":{74:"B",77:"D",79:"F",80:"J",81:"I",82:"H",85:"G",87:"L"},
  "B,D,F,G,H,I,K,L":{74:"B",77:"D",79:"F",80:"K",81:"I",82:"H",85:"G",87:"L"},
  "B,D,F,G,H,J,K,L":{74:"B",77:"D",79:"F",80:"K",81:"J",82:"H",85:"G",87:"L"},
  "B,D,F,G,I,J,K,L":{74:"B",77:"D",79:"F",80:"K",81:"I",82:"J",85:"G",87:"L"},
  "B,D,F,H,I,J,K,L":{74:"B",77:"D",79:"F",80:"K",81:"I",82:"H",85:"J",87:"L"},
  "B,D,G,H,I,J,K,L":{74:"B",77:"D",79:"I",80:"K",81:"J",82:"H",85:"G",87:"L"},
  "B,E,F,G,H,I,J,K":{74:"B",77:"F",79:"E",80:"K",81:"J",82:"H",85:"G",87:"I"},
  "B,E,F,G,H,I,J,L":{74:"B",77:"F",79:"E",80:"J",81:"I",82:"H",85:"G",87:"L"},
  "B,E,F,G,H,I,K,L":{74:"B",77:"F",79:"E",80:"K",81:"I",82:"H",85:"G",87:"L"},
  "B,E,F,G,H,J,K,L":{74:"B",77:"F",79:"E",80:"K",81:"J",82:"H",85:"G",87:"L"},
  "B,E,F,G,I,J,K,L":{74:"B",77:"F",79:"E",80:"K",81:"J",82:"I",85:"G",87:"L"},
  "B,E,F,H,I,J,K,L":{74:"B",77:"F",79:"E",80:"K",81:"J",82:"H",85:"I",87:"L"},
  "B,E,G,H,I,J,K,L":{74:"B",77:"G",79:"E",80:"K",81:"J",82:"H",85:"I",87:"L"},
  "B,F,G,H,I,J,K,L":{74:"B",77:"F",79:"I",80:"K",81:"J",82:"H",85:"G",87:"L"},
  "C,D,E,F,G,H,I,J":{74:"F",77:"G",79:"C",80:"I",81:"J",82:"H",85:"E",87:"D"},
  "C,D,E,F,G,H,I,K":{74:"F",77:"G",79:"C",80:"K",81:"E",82:"H",85:"I",87:"D"},
  "C,D,E,F,G,H,I,L":{74:"F",77:"D",79:"C",80:"E",81:"I",82:"H",85:"G",87:"L"},
  "C,D,E,F,G,H,J,K":{74:"F",77:"G",79:"C",80:"K",81:"J",82:"H",85:"E",87:"D"},
  "C,D,E,F,G,H,J,L":{74:"F",77:"D",79:"C",80:"J",81:"E",82:"H",85:"G",87:"L"},
  "C,D,E,F,G,H,K,L":{74:"F",77:"D",79:"C",80:"K",81:"E",82:"H",85:"G",87:"L"},
  "C,D,E,F,G,I,J,K":{74:"F",77:"G",79:"C",80:"K",81:"I",82:"J",85:"E",87:"D"},
  "C,D,E,F,G,I,J,L":{74:"F",77:"D",79:"C",80:"I",81:"J",82:"E",85:"G",87:"L"},
  "C,D,E,F,G,I,K,L":{74:"F",77:"D",79:"C",80:"K",81:"E",82:"I",85:"G",87:"L"},
  "C,D,E,F,G,J,K,L":{74:"F",77:"D",79:"C",80:"K",81:"J",82:"E",85:"G",87:"L"},
  "C,D,E,F,H,I,J,K":{74:"F",77:"D",79:"C",80:"K",81:"I",82:"H",85:"J",87:"E"},
  "C,D,E,F,H,I,J,L":{74:"F",77:"D",79:"C",80:"I",81:"J",82:"H",85:"E",87:"L"},
  "C,D,E,F,H,I,K,L":{74:"F",77:"D",79:"C",80:"K",81:"E",82:"H",85:"I",87:"L"},
  "C,D,E,F,H,J,K,L":{74:"F",77:"D",79:"C",80:"K",81:"J",82:"H",85:"E",87:"L"},
  "C,D,E,F,I,J,K,L":{74:"F",77:"D",79:"C",80:"K",81:"I",82:"J",85:"E",87:"L"},
  "C,D,E,G,H,I,J,K":{74:"D",77:"G",79:"C",80:"K",81:"I",82:"H",85:"J",87:"E"},
  "C,D,E,G,H,I,J,L":{74:"D",77:"G",79:"C",80:"I",81:"J",82:"H",85:"E",87:"L"},
  "C,D,E,G,H,I,K,L":{74:"D",77:"G",79:"C",80:"K",81:"E",82:"H",85:"I",87:"L"},
  "C,D,E,G,H,J,K,L":{74:"D",77:"G",79:"C",80:"K",81:"J",82:"H",85:"E",87:"L"},
  "C,D,E,G,I,J,K,L":{74:"D",77:"G",79:"C",80:"K",81:"I",82:"J",85:"E",87:"L"},
  "C,D,E,H,I,J,K,L":{74:"D",77:"C",79:"E",80:"K",81:"J",82:"H",85:"I",87:"L"},
  "C,D,F,G,H,I,J,K":{74:"F",77:"G",79:"C",80:"K",81:"J",82:"H",85:"I",87:"D"},
  "C,D,F,G,H,I,J,L":{74:"F",77:"D",79:"C",80:"I",81:"J",82:"H",85:"G",87:"L"},
  "C,D,F,G,H,I,K,L":{74:"F",77:"D",79:"C",80:"K",81:"I",82:"H",85:"G",87:"L"},
  "C,D,F,G,H,J,K,L":{74:"F",77:"D",79:"C",80:"K",81:"J",82:"H",85:"G",87:"L"},
  "C,D,F,G,I,J,K,L":{74:"F",77:"D",79:"C",80:"K",81:"I",82:"J",85:"G",87:"L"},
  "C,D,F,H,I,J,K,L":{74:"F",77:"D",79:"C",80:"K",81:"J",82:"H",85:"I",87:"L"},
  "C,D,G,H,I,J,K,L":{74:"D",77:"G",79:"C",80:"K",81:"J",82:"H",85:"I",87:"L"},
  "C,E,F,G,H,I,J,K":{74:"F",77:"G",79:"C",80:"K",81:"I",82:"H",85:"J",87:"E"},
  "C,E,F,G,H,I,J,L":{74:"F",77:"G",79:"C",80:"I",81:"J",82:"H",85:"E",87:"L"},
  "C,E,F,G,H,I,K,L":{74:"F",77:"G",79:"C",80:"K",81:"E",82:"H",85:"I",87:"L"},
  "C,E,F,G,H,J,K,L":{74:"F",77:"G",79:"C",80:"K",81:"J",82:"H",85:"E",87:"L"},
  "C,E,F,G,I,J,K,L":{74:"F",77:"G",79:"C",80:"K",81:"I",82:"J",85:"E",87:"L"},
  "C,E,F,H,I,J,K,L":{74:"F",77:"C",79:"E",80:"K",81:"J",82:"H",85:"I",87:"L"},
  "C,E,G,H,I,J,K,L":{74:"C",77:"G",79:"E",80:"K",81:"J",82:"H",85:"I",87:"L"},
  "C,F,G,H,I,J,K,L":{74:"F",77:"G",79:"C",80:"K",81:"J",82:"H",85:"I",87:"L"},
  "D,E,F,G,H,I,J,K":{74:"F",77:"G",79:"E",80:"K",81:"J",82:"H",85:"I",87:"D"},
  "D,E,F,G,H,I,J,L":{74:"F",77:"D",79:"I",80:"J",81:"E",82:"H",85:"G",87:"L"},
  "D,E,F,G,H,I,K,L":{74:"F",77:"D",79:"E",80:"K",81:"I",82:"H",85:"G",87:"L"},
  "D,E,F,G,H,J,K,L":{74:"F",77:"D",79:"E",80:"K",81:"J",82:"H",85:"G",87:"L"},
  "D,E,F,G,I,J,K,L":{74:"F",77:"D",79:"I",80:"K",81:"J",82:"E",85:"G",87:"L"},
  "D,E,F,H,I,J,K,L":{74:"F",77:"D",79:"E",80:"K",81:"J",82:"H",85:"I",87:"L"},
  "D,E,G,H,I,J,K,L":{74:"D",77:"G",79:"E",80:"K",81:"J",82:"H",85:"I",87:"L"},
  "D,F,G,H,I,J,K,L":{74:"F",77:"D",79:"I",80:"K",81:"J",82:"H",85:"G",87:"L"},
  "E,F,G,H,I,J,K,L":{74:"F",77:"G",79:"E",80:"K",81:"J",82:"H",85:"I",87:"L"},
};

// ── OFFICIAL THIRD-PLACE ASSIGNMENT FUNCTION ──
// Uses the complete 495-combination official assignment table above.
// Falls back to greedy matching (with UI warning) if combination not found.
function assignThirdPlaceTeamsOfficial(bestThirds){
  const key=bestThirds.map(t=>t.group).sort().join(",");
  const assignment=THIRD_PLACE_ASSIGNMENTS[key];

  if(assignment){
    // Official table match
    const byGroup=Object.fromEntries(bestThirds.map(t=>[t.group,t]));
    const out={};
    Object.entries(assignment).forEach(([matchId,group])=>{
      const team=byGroup[group];
      if(!team) throw new Error(`Third-place assignment error: group ${group} for match ${matchId}`);
      out[Number(matchId)]=team;
    });
    return out;
  }

  // Fallback: greedy matching (should never happen with 495-combo table)
  // "Missing official third-place assignment" — log clearly for debugging
  const warnMsg=`Missing official third-place assignment for qualifying groups: ${key} — using greedy fallback`;
  console.warn(warnMsg);
  const slots=OFFICIAL_R32_SLOTS.filter(s=>s.b.type==="third");
  const assigned={};
  const usedGroups=new Set();
  for(const slot of slots){
    for(const t of bestThirds){
      if(!usedGroups.has(t.group)&&slot.b.allowed.includes(t.group)){
        assigned[slot.id]=t; usedGroups.add(t.group); break;
      }
    }
    if(!assigned[slot.id]){
      const fb=bestThirds.find(t=>!usedGroups.has(t.group));
      if(fb){assigned[slot.id]=fb;usedGroups.add(fb.group);}
    }
  }
  return assigned;
}

// ── POISSON & MATH ──
function poisson(lambda){const L=Math.exp(-lambda);let k=0,p=1;do{k++;p*=Math.random();}while(p>L);return k-1;}
function clamp(x,mn,mx){return Math.max(mn,Math.min(mx,x));}
function apS(t,s){
  let r=t.rating;
  if(!s?.a||!Object.keys(s.a).length)return r;
  const a=s.a;
  if(a.t==="dog"&&r<70)r+=18;
  if(a.t==="chaos")r+=(Math.random()-.5)*60;
  if(a.t==="host"&&["USA","Mexico","Canada"].includes(t.name))r+=15;
  if(a.t==="conf"&&(t.conf===a.c||(a.c==="AFC"&&t.conf==="OFC")))r+=a.v;
  return Math.max(20,Math.min(99,r));
}
function sM(a,b,s,stage="sim"){
  const rA=apS(a,s),rB=apS(b,s);
  const mode=s?.a?.t;
  const base=mode==="defense"?0.85:mode==="goals"?1.65:1.18;
  const expA=clamp(base+(rA-rB)/38+(rA-70)/120,0.25,3.6);
  const expB=clamp(base+(rB-rA)/38+(rB-70)/120,0.25,3.6);
  return{gA:poisson(expA),gB:poisson(expB)};
}
function simulateOrReal(matchId,home,away,scenario,stage){
  const real=RESULT_STATE.byMatchId[matchId];
  if(real?.locked)return{gA:real.homeScore,gB:real.awayScore,locked:true,source:real.source};
  return{...sM(getT(home),getT(away),scenario,stage),locked:false,source:"simulation"};
}
function sK(a,b,s,stage="ko",matchId=null){
  const real=matchId?RESULT_STATE.byMatchId[matchId]:null;
  if(real?.locked){
    const pen=real.penalties||false;
    return{t1:a,t2:b,gA:real.homeScore,gB:real.awayScore,pen,pA:real.homePens||0,pB:real.awayPens||0,
      w:real.homeAdvances?a:b,locked:true,source:real.source,matchId};
  }
  let{gA,gB}=sM(a,b,s,stage);
  let pen=false,pA=0,pB=0;
  if(gA===gB){pen=true;pA=3+Math.floor(Math.random()*3);pB=3+Math.floor(Math.random()*3);while(pA===pB){pA=3+Math.floor(Math.random()*3);pB=3+Math.floor(Math.random()*3);}}
  return{t1:a,t2:b,gA,gB,pen,pA,pB,w:pen?(pA>pB?a:b):(gA>gB?a:b),locked:false,source:"simulation",matchId};
}

// ── GROUP STAGE (uses OFFICIAL_MATCHES + RESULT_STATE) ──
function sG(s){
  const r={};
  for(const[g,ns] of Object.entries(GROUPS)){
    const ts=ns.map(getT);
    const st=ts.map(t=>({...t,pts:0,gf:0,ga:0,gd:0,w:0,d:0,l:0,group:g}));
    const ms=[];
    for(const m of OFFICIAL_MATCHES.filter(x=>x.group===g)){
      const res=simulateOrReal(m.id,m.home,m.away,s,"group");
      const{gA,gB}=res;
      const tA=getT(m.home),tB=getT(m.away);
      ms.push({tA,tB,gA,gB,locked:res.locked,source:res.source,matchId:m.id});
      const sa=st.find(x=>x.name===m.home),sb=st.find(x=>x.name===m.away);
      if(sa&&sb){
        sa.gf+=gA;sa.ga+=gB;sb.gf+=gB;sb.ga+=gA;
        if(gA>gB){sa.pts+=3;sa.w++;sb.l++;}
        else if(gA<gB){sb.pts+=3;sb.w++;sa.l++;}
        else{sa.pts++;sb.pts++;sa.d++;sb.d++;}
      }
    }
    st.forEach(x=>{x.gd=x.gf-x.ga;});
    st.sort((a,b)=>b.pts-a.pts||b.gd-a.gd||b.gf-a.gf||a.name.localeCompare(b.name));
    r[g]={standings:st,matches:ms};
  }
  return r;
}

// ── RESOLVED KNOCKOUT MATCHES (populated after each simulation) ──
// Enables live ESPN results to lock into knockout rounds
let RESOLVED_KO_MATCHES = {};

function registerResolvedKnockouts(matches){
  RESOLVED_KO_MATCHES = {};
  (matches||[]).forEach(m=>{
    if(!m?.id||!m?.t1?.name||!m?.t2?.name) return;
    RESOLVED_KO_MATCHES[m.id]={id:m.id,stage:m.stage,home:m.t1.name,away:m.t2.name};
  });
}

// ── ADMIN OVERRIDE (highest priority — never overwritten) ──
const ADMIN_RESULT_OVERRIDES = {
  // matchId: { id, home, away, homeScore, awayScore, locked, source, homeAdvances }
  // Add emergency overrides here when API data is wrong or delayed
};

// ── OFFICIAL TOURNAMENT BRACKET ──
// Match IDs follow official schedule: 1–72 group, 73–88 R32, 89–96 R16,
// 97–100 QF, 101–102 SF, 103 Final, 104 Third-place
function buildOfficialTournament(gr,s){
  const qual={};
  const thirds=[];
  for(const[g,d] of Object.entries(gr)){
    qual[g]={winner:{...d.standings[0],group:g},runner:{...d.standings[1],group:g}};
    thirds.push({...d.standings[2],group:g});
  }
  const bestThirds=thirds.sort((a,b)=>b.pts-a.pts||b.gd-a.gd||b.gf-a.gf).slice(0,8);
  const thirdMap=assignThirdPlaceTeamsOfficial(bestThirds);

  function resolveSlot(slot,matchId){
    if(slot.type==="winner") return qual[slot.group]?.winner||getT(slot.group);
    if(slot.type==="runner") return qual[slot.group]?.runner||getT(slot.group);
    if(slot.type==="third"){
      const team=thirdMap[matchId];
      if(!team) throw new Error(`No third-place team assigned to match ${matchId}`);
      return team;
    }
  }

  // R32: official IDs 73–88 (slot.id is already 73–88, pass directly)
  const r32=OFFICIAL_R32_SLOTS.map(slot=>{
    const ta=resolveSlot(slot.a,slot.id),tb=resolveSlot(slot.b,slot.id);
    return{...sK(ta,tb,s,"ko32",slot.id),id:slot.id,stage:"ko32"};
  });
  // R16: official IDs 89–96
  const r16=OFFICIAL_R16.map(slot=>{
    const ma=r32.find(m=>m.id===slot.from[0]),mb=r32.find(m=>m.id===slot.from[1]);
    return{...sK(ma.w,mb.w,s,"ko16",slot.id),id:slot.id,stage:"ko16"};
  });
  // QF: official IDs 97–100
  const qf=OFFICIAL_QF.map(slot=>{
    const ma=r16.find(m=>m.id===slot.from[0]),mb=r16.find(m=>m.id===slot.from[1]);
    return{...sK(ma.w,mb.w,s,"koqf",slot.id),id:slot.id,stage:"koqf"};
  });
  // SF: official IDs 101–102
  const sf=OFFICIAL_SF.map(slot=>{
    const ma=qf.find(m=>m.id===slot.from[0]),mb=qf.find(m=>m.id===slot.from[1]);
    return{...sK(ma.w,mb.w,s,"kosf",slot.id),id:slot.id,stage:"kosf"};
  });
  // Final: ID 103 · Third place: ID 104
  const fin={...sK(sf[0].w,sf[1].w,s,"kofin",103),id:103,stage:"kofin"};
  const l1=sf[0].w===sf[0].t1?sf[0].t2:sf[0].t1,l2=sf[1].w===sf[1].t1?sf[1].t2:sf[1].t1;
  const trd={...sK(l1,l2,s,"ko3p",104),id:104,stage:"ko3p"};

  // Register KO matches so applyLiveData() can lock ESPN results into them
  registerResolvedKnockouts([...r32,...r16,...qf,...sf,fin,trd]);

  return{r32,r16,qf,sf,fin,trd};
}

// ── FUN TOURNAMENT (random bracket) ──
function buildFunTournament(pool,s){
  const sh=(arr=>{const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;})(pool);
  const r32=[],r16=[],qf=[],sf=[];
  for(let i=0;i<32;i+=2)r32.push(sK(sh[i],sh[i+1],s,"ko32"));
  for(let i=0;i<16;i+=2)r16.push(sK(r32[i].w,r32[i+1].w,s,"ko16"));
  for(let i=0;i<8;i+=2) qf.push(sK(r16[i].w,r16[i+1].w,s,"koqf"));
  for(let i=0;i<4;i+=2) sf.push(sK(qf[i].w,qf[i+1].w,s,"kosf"));
  const fin=sK(sf[0].w,sf[1].w,s,"kofin");
  const l1=sf[0].w===sf[0].t1?sf[0].t2:sf[0].t1,l2=sf[1].w===sf[1].t1?sf[1].t2:sf[1].t1;
  const trd=sK(l1,l2,s,"ko3p");
  return{r32,r16,qf,sf,fin,trd};
}

// ── MAIN SIMULATION ──
function simAll(s,opts={}){
  const{bracketMode="official"}=opts;
  const gr=sG(s);
  const pool=[];
  for(const r of Object.values(gr)){pool.push(r.standings[0],r.standings[1]);}
  const thirds=Object.values(gr).map(r=>r.standings[2]).sort((a,b)=>b.pts-a.pts||b.gd-a.gd||b.gf-a.gf);
  thirds.slice(0,8).forEach(t=>pool.push(t));
  if(pool.length!==32)throw new Error(`Integrity error: expected 32 teams, got ${pool.length}. Refresh and try again.`);
  const qualifiedNames=new Set(pool.map(t=>t.name));
  const ko=bracketMode==="fun"?buildFunTournament(pool,s):buildOfficialTournament(gr,s);
  const{r32,r16,qf,sf,fin,trd}=ko;
  const allMs=[...Object.values(gr).flatMap(g=>g.matches),...r32,...r16,...qf,...sf,fin,trd];
  const tg=allMs.reduce((x,m)=>x+(m.gA||0)+(m.gB||0),0);
  console.assert(r32.length===16,`R32: got ${r32.length}`);
  console.assert(r16.length===8, `R16: got ${r16.length}`);
  console.assert(qf.length===4,  `QF: got ${qf.length}`);
  console.assert(sf.length===2,  `SF: got ${sf.length}`);
  return{gr,r32,r16,qf,sf,fin,trd,tg,qualifiedNames:[...qualifiedNames],bracketMode};
}

// ── MONTE CARLO (with proper cancel + stage tracking) ──
async function runMCAsync(sc,n,onProgress,shouldCancel,opts={}){
  const counts={};
  const ensure=name=>{
    if(!counts[name])counts[name]={r32:0,r16:0,qf:0,sf:0,final:0,champion:0};
    return counts[name];
  };
  const chunk=10;
  for(let i=0;i<n;i+=chunk){
    if(shouldCancel&&shouldCancel())return null;
    const end=Math.min(i+chunk,n);
    for(let j=i;j<end;j++){
      if(shouldCancel&&shouldCancel())return null;
      const sim=simAll(sc,opts);
      sim.r32.forEach(m=>{ensure(m.t1.name).r32++;ensure(m.t2.name).r32++;});
      sim.r16.forEach(m=>{ensure(m.t1.name).r16++;ensure(m.t2.name).r16++;});
      sim.qf.forEach(m=>{ensure(m.t1.name).qf++;ensure(m.t2.name).qf++;});
      sim.sf.forEach(m=>{ensure(m.t1.name).sf++;ensure(m.t2.name).sf++;});
      ensure(sim.fin.t1.name).final++;ensure(sim.fin.t2.name).final++;
      ensure(sim.fin.w.name).champion++;
    }
    onProgress(Math.round((end/n)*100));
    await new Promise(resolve=>typeof requestAnimationFrame!=="undefined"?requestAnimationFrame(resolve):setTimeout(resolve,0));
  }
  return Object.entries(counts)
    .map(([name,c])=>({name,flag:SQUADS[name]?.flag||"🏳️",
      r32:+((c.r32/n)*100).toFixed(1),r16:+((c.r16/n)*100).toFixed(1),
      qf:+((c.qf/n)*100).toFixed(1),sf:+((c.sf/n)*100).toFixed(1),
      final:+((c.final/n)*100).toFixed(1),champion:+((c.champion/n)*100).toFixed(1)}))
    .sort((a,b)=>b.champion-a.champion);
}

// ── FIND KNOWN MATCH (group OR knockout) ──
function findKnownMatch(t1n,t2n){
  // Search both the 72 group matches and any registered KO matches
  const group=OFFICIAL_MATCHES.find(m=>(m.home===t1n&&m.away===t2n)||(m.home===t2n&&m.away===t1n));
  if(group) return{...group,isKO:false};
  const ko=Object.values(RESOLVED_KO_MATCHES).find(m=>(m.home===t1n&&m.away===t2n)||(m.home===t2n&&m.away===t1n));
  if(ko) return{...ko,isKO:true};
  return null;
}

// ── APPLY LIVE DATA → RESULT_STATE (group + KO) ──
function applyLiveData(espnEvents){
  const fresh={};
  (espnEvents||[]).forEach(ev=>{
    const comp=ev.competitions?.[0];if(!comp)return;
    const home=comp.competitors?.find(c=>c.homeAway==="home");
    const away=comp.competitors?.find(c=>c.homeAway==="away");
    if(!home||!away)return;
    const t1n=normalizeTeamName(home.team?.displayName||"");
    const t2n=normalizeTeamName(away.team?.displayName||"");
    const status=comp.status?.type?.state||"pre";
    const locked=status==="post";
    if(!locked) return; // only process completed matches
    const knownM=findKnownMatch(t1n,t2n);
    if(!knownM) return; // not a match we track
    const flipped=knownM.home===t2n;
    const homeScore=flipped?parseInt(away.score||0):parseInt(home.score||0);
    const awayScore=flipped?parseInt(home.score||0):parseInt(away.score||0);
    // Use ESPN's winner field for knockout matches (handles extra time / pens)
    const homeRaw=flipped?away:home;
    const awayRaw=flipped?home:away;
    const homeWinner=homeRaw.winner===true||homeRaw.winner==="true";
    const awayWinner=awayRaw.winner===true||awayRaw.winner==="true";
    const homePens=parseInt(homeRaw.shootoutScore??homeRaw.penaltyScore??homeRaw.penalties??0);
    const awayPens=parseInt(awayRaw.shootoutScore??awayRaw.penaltyScore??awayRaw.penalties??0);
    const penalties=knownM.isKO&&homeScore===awayScore&&(homePens>0||awayPens>0);
    let homeAdvances;
    if(homeWinner||awayWinner){homeAdvances=homeWinner;}
    else if(penalties){homeAdvances=homePens>awayPens;}
    else{homeAdvances=homeScore>awayScore;}
    fresh[knownM.id]={
      id:knownM.id,home:knownM.home,away:knownM.away,
      homeScore,awayScore,
      status,locked,source:"ESPN",updatedAt:new Date().toISOString(),
      penalties,homePens,awayPens,homeAdvances,
    };
  });
  // Priority: ADMIN_RESULT_OVERRIDES > MANUAL_VERIFIED_RESULTS > ESPN API
  Object.entries(fresh).forEach(([id,result])=>{
    const existing=RESULT_STATE.byMatchId[id];
    if(!existing||!existing.source?.startsWith("Verified")){
      RESULT_STATE.byMatchId[id]=result;
    }
  });
  // Admin overrides always win
  Object.assign(RESULT_STATE.byMatchId,ADMIN_RESULT_OVERRIDES);
}


// ── GITHUB RAW URL ── Update YOUR_USERNAME once after creating the repo ──
// This URL is CORS-free and auto-updates every 5 minutes via GitHub Actions
const GITHUB_RESULTS_URL="https://raw.githubusercontent.com/footballsim2026-wq/wc2026-results/main/results.json";

async function fetchFromGitHub(){
  // Reads pre-processed results.json — no ESPN parsing needed, no CORS issues
  const r=await fetch(GITHUB_RESULTS_URL+"?t="+Date.now(),{cache:"no-store"});
  if(!r.ok) throw new Error(`GitHub results ${r.status}`);
  const d=await r.json();

  // Merge into RESULT_STATE — manual verified results always win
  const ghResults=d.results||{};
  let newCount=0;
  Object.entries(ghResults).forEach(([id,result])=>{
    const existing=RESULT_STATE.byMatchId[id];
    if(!existing||!existing.source?.startsWith("Verified")){
      RESULT_STATE.byMatchId[id]={...result,locked:true};
      newCount++;
    }
  });

  // Also apply admin overrides (always highest priority)
  Object.assign(RESULT_STATE.byMatchId,ADMIN_RESULT_OVERRIDES);

  LIVE_STATE.lastFetch=new Date();
  LIVE_STATE.error=null;
  LIVE_STATE.githubLocked=d.totalLocked||0;
  LIVE_STATE.githubUpdatedAt=d.updatedAt||null;
  return d;
}

async function fetchFromESPN(){
  // Fallback to ESPN directly (works in production, may fail in demo due to CORS)
  const LIVE_API=typeof window!=="undefined"&&window.location.hostname!=="localhost"
    ?"/api/live-scores"
    :"https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard";
  const r=await fetch(LIVE_API,{cache:"no-store"});
  if(!r.ok) throw new Error(`ESPN ${r.status}`);
  const d=await r.json();
  const events=d.events||d.data?.events||[];
  const matches={};const byKey={};
  events.forEach(ev=>{
    const comp=ev.competitions?.[0];if(!comp)return;
    const home=comp.competitors?.find(c=>c.homeAway==="home");
    const away=comp.competitors?.find(c=>c.homeAway==="away");
    if(!home||!away)return;
    const t1n=normalizeTeamName(home.team?.displayName||"");
    const t2n=normalizeTeamName(away.team?.displayName||"");
    const status=comp.status?.type?.state||"pre";
    const locked=status==="post";
    const notesText=(comp.notes||[]).map(n=>n.headline||"").join(" ").toLowerCase();
    const stage=notesText.includes("round of 32")?"ko32":notesText.includes("round of 16")?"ko16":notesText.includes("quarter")?"koqf":notesText.includes("semi")?"kosf":notesText.includes("third")?"ko3p":notesText.includes("final")?"kofin":"group";
    const matchObj={t1:t1n,t2:t2n,s1:parseInt(home.score||0),s2:parseInt(away.score||0),status,locked,stage,clock:comp.status?.displayClock||"",detail:comp.status?.type?.shortDetail||"",date:ev.date,id:ev.id};
    matches[ev.id]=matchObj;
    if(locked)byKey[makeMatchKey(stage,t1n,t2n)]=matchObj;
  });
  LIVE_STATE.matches=matches;LIVE_STATE.byKey=byKey;
  LIVE_STATE.lastFetch=new Date();LIVE_STATE.error=null;
  applyLiveData(events);
  return matches;
}

async function fetchLiveScores(){
  // Strategy: try GitHub (pre-processed, CORS-free) first, then ESPN as fallback
  try{
    await fetchFromGitHub();
    // Also fetch ESPN for the live-bar display (ongoing matches, clocks)
    // This may fail in demo sandbox — that's OK, results are already loaded from GitHub
    fetchFromESPN().catch(()=>{});
    return LIVE_STATE.matches;
  }catch(ghErr){
    // GitHub unavailable — fall back to ESPN directly
    LIVE_STATE.error="GitHub unavailable: "+ghErr.message;
    try{
      return await fetchFromESPN();
    }catch(espnErr){
      LIVE_STATE.error="All sources failed: "+espnErr.message;
      return null;
    }
  }
}

async function apiReport(match){
  const t1=match.t1?.name||match.tA?.name,t2=match.t2?.name||match.tB?.name;
  const sc=match.gA+"-"+match.gB;
  const pi=match.pen?" (pens "+match.pA+"-"+match.pB+")":"";
  try{
    const r=await fetch("/api/match-report",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({t1,t2,score:sc,penalties:pi})});
    if(!r.ok) throw new Error("unavailable");
    const d=await r.json();
    return d.text||d.content||REPORT_FALLBACKS[0](t1,t2,sc,pi);
  }catch{return REPORT_FALLBACKS[Math.floor(Math.random()*REPORT_FALLBACKS.length)](t1,t2,sc,pi);}
}
async function apiTranslate(text){
  try{
    const r=await fetch("/api/translate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text})});
    if(!r.ok) throw new Error("unavailable");
    const d=await r.json();
    return d.text||d.translation||"(unavailable)";
  }catch{return "(translation requires /api/translate backend)";}
}


// ── FAN REACTIONS DATA ──
const LANGS=[{c:"en",n:"English",f:"🇺🇸"},{c:"es",n:"Español",f:"🇪🇸"},{c:"fr",n:"Français",f:"🇫🇷"},{c:"pt",n:"Português",f:"🇧🇷"},{c:"ar",n:"العربية",f:"🇸🇦"},{c:"de",n:"Deutsch",f:"🇩🇪"},{c:"ja",n:"日本語",f:"🇯🇵"},{c:"ko",n:"한국어",f:"🇰🇷"}];
const CMT={
  en:["GOAL! Absolute worldie! 🔥","What a match — {t1} are unstoppable!","My bracket is completely destroyed 😭","{t2} fighting back — incredible scenes!","Someone please stop {t1}! 🔥","Penalty shootout incoming — I can't watch!","The ref is having an absolute nightmare 😤","Tournament of the century right here! 🏆"],
  es:["¡GOOOL de {t1}! 🔥","¡{t1} imparable esta noche!","¡Mi pronóstico destruido! 😭","¡{t2} remontando — increíble!","¡Torneo histórico! 🏆","¡Paren a {t1}! 🔥"],
  fr:["BUUUT de {t1}! 🔥","{t1} est inarrêtable ce soir!","Mon pronostic détruit 😭","{t2} revient — incroyable!","Quel tournoi! 🏆","Arrêtez {t1}! 🔥"],
  pt:["GOOOOL do {t1}! 🔥","{t1} imparável esta noite!","Meu palpite destruído 😭","{t2} voltando — incrível!","Que torneio! 🏆","Parem {t1}! 🔥"],
  ar:["هدف خرافي من {t1}! 🔥","{t1} لا يُوقف الليلة!","توقعاتي دُمِّرت 😭","{t2} يعود — مذهل!","ما هذه البطولة! 🏆","أوقفوا {t1}! 🔥"],
  de:["TOR von {t1}! Unglaublich! 🔥","{t1} heute nicht zu stoppen!","Mein Tipp ruiniert 😭","{t2} kämpft zurück! Wahnsinn!","Was für ein Turnier! 🏆"],
  ja:["{t1}の信じられないゴール！🔥","{t1}は今夜止められない！","予想が全滅 😭","{t2}が追いついた！すごい！","なんという大会！🏆"],
  ko:["{t1}의 믿을 수 없는 골！🔥","{t1}는 오늘 막을 수 없어！","내 예측이 다 망했어 😭","{t2}가 반격！믿을 수 없어！"],
};
const USERS=["GoalMachine99","UltrasForever","TacticsNerd","PressBoxPro","FinalWhistle","HatTrickHero","OffsideTrap","SetPieceKing","TikiTakaMaster","MatchdayMagic","GoldenBootFan","RedCardRage","CornerFlagKick","StrikerInstinct","DerbyDayKing","BoxToBoxMid","PenaltyAreaPro","SubstituteLord","DeepBlockMaster","TikiTakaFan"];

// ── LEGAL PAGES ──
const LEGAL = {
  privacy:{title:"Privacy Policy",icon:"🔒",body:`Last updated: ${DATA_VERIFIED}\n\nGlobal Football Simulator 2026 is an independent fan-made entertainment tool not affiliated with FIFA.\n\nDATA WE COLLECT\nWe may use Google Analytics or Google AdSense. These services may use cookies or similar technologies to measure traffic, improve the site, and serve ads. We do not directly collect personal information.\n\nTHIRD-PARTY ADVERTISING\nThird-party vendors, including Google, may use cookies to serve ads based on a user's prior visits to this site or other websites. Google's use of advertising cookies enables it and its partners to serve ads based on your visit here and/or other sites on the Internet.\n\nGOOGLE EU CONSENT\nWhere legally required, we comply with Google's EU User Consent Policy for Analytics and AdSense advertising features.\n\nCOOKIES\nYou can opt out of personalised advertising at https://adssettings.google.com or via your browser settings.\n\nCHILDREN\nWe do not knowingly collect personal information from children. Users should not submit personal data in fan reactions or contact forms.\n\nFAN REACTIONS\nFan reactions in the current version are simulated or stored locally in the browser session only. They are not public social-media posts.\n\nCONTACT\nprivacy@globalfootballsim.com`},
  terms:{title:"Terms of Use",icon:"📋",body:`Last updated: ${DATA_VERIFIED}\n\nENTERTAINMENT ONLY\nThis site is an entertainment simulator. Results are randomly generated and are not predictions, betting advice, gambling advice, sports advice, or official tournament data.\n\nBRACKET MODE\nKnockout brackets may be randomised unless clearly marked as Official Bracket Mode. They do not represent the official FIFA tournament bracket.\n\nFAN REACTIONS\nUser-entered fan reactions are stored locally in the browser session only and are not real public comments.\n\nNOT AFFILIATED\nNot affiliated with FIFA, FIFA World Cup, any national federation, broadcaster, sponsor, or official rights holder. No official logos, emblems, trophy images, mascots, match footage, or protected tournament marks are used.\n\nDATA ACCURACY\nSquad data from FIFA published final lists. Injury replacements may occur up to 24 hours before first matches. Independent app data may lag official sources.\n\nINTELLECTUAL PROPERTY\nTeam and player names used for editorial purposes only. No official logos or trademarks used.\n\nADVERTISING\nThis site may display third-party ads. We are not responsible for ad content.`},
  about:{title:"About",icon:"ℹ️",body:`Global Football Simulator 2026 is an independent fan-made simulator for all 48 qualifying nations.\n\nWHAT IT DOES\n• Full group stage (12 groups × 6 matches = 72)\n• Top 2 per group + 8 best third-placed = 32 teams\n• Full knockout: R32 → R16 → QF → SF → Final\n• 1,000 Monte Carlo simulations for probability\n• AI match reports + multilingual fan reactions\n\nHOW RATINGS WORK\nIndependent model estimates (out of 100) based on recent form, squad quality, and history. Not official FIFA rankings.\n\nNOT AFFILIATED WITH\nFIFA, any national federation, or any official organiser.`},
  methodology:{title:"Methodology",icon:"📊",body:`SQUAD DATA\nSource: Official FIFA Squad PDF — ${DATA_SOURCE}\nAll 48 teams, 26 players each = 1,248 players total.\n\nCOACH DATA\nExtracted from the same official FIFA document.\n\nSIMULATION LOGIC\n• Group: Round-robin (6 matches/group)\n• Tiebreaker: Points → GD → GF\n• Knockout draws → penalties (3-5 goals each side)\n• Best 8 third-placed teams advance\n\nMONTE CARLO\n1,000 async simulations to calculate probability. Not a prediction tool.\n\nAI REPORTS\nGenerated by Claude (Anthropic). Entertainment only.`},
  contact:{title:"Contact",icon:"✉️",body:`SQUAD DATA ISSUES\nEmail: data@globalfootballsim.com\nWe review all reports within 48 hours.\n\nGENERAL ENQUIRIES\nEmail: hello@globalfootballsim.com\n\nADVERTISING\nEmail: ads@globalfootballsim.com\n\nPRESS\nEmail: press@globalfootballsim.com`},
};


// ── COMPONENTS ──

// Global CSS




// ── STICKY MOBILE ACTION BAR ──
function StickyBar({onRun,running,onShare,hasSim,favTeam,setFavTeam,onOdds,mcRunning}){
  return(
    <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:8000,background:T.card,borderTop:`1px solid ${T.border}`,padding:"8px 12px",display:"flex",gap:6,alignItems:"center",
      // Only show on mobile
      boxShadow:"0 -2px 12px rgba(0,0,0,0.4)"}}>
      <button onClick={onRun} disabled={running} aria-label="Run simulation"
        style={{flex:2,padding:"9px",background:running?"rgba(255,255,255,0.04)":T.gradBtnGreen,border:"none",borderRadius:10,color:running?T.muted:"#fff",fontWeight:800,fontSize:12,cursor:running?"wait":"pointer"}}>
        {running?"⏳ Running…":"🎲 Simulate"}
      </button>
      <button onClick={onOdds} disabled={running} aria-label="View champion odds"
        style={{flex:1,padding:"9px",background:mcRunning?"rgba(255,255,255,0.04)":T.gradBtnPurple,border:"none",borderRadius:10,color:mcRunning?T.muted:"#fff",fontWeight:700,fontSize:11,cursor:"pointer"}}>
        🎯 Odds
      </button>
      {hasSim&&<button onClick={onShare} aria-label="Share result"
        style={{flex:1,padding:"9px",background:"transparent",border:`1px solid ${T.border}`,borderRadius:10,color:T.muted,fontWeight:700,fontSize:11,cursor:"pointer"}}>
        📤 Share
      </button>}
    </div>
  );
}

// ── SEO META TAGS (inject into document head) ──
function SEOMeta(){
  useEffect(()=>{
    document.title="Global Football Simulator 2026 — Simulate the 48-Team Tournament";
    const setMeta=(name,content,prop=false)=>{
      const sel=prop?`meta[property="${name}"]`:`meta[name="${name}"]`;
      let el=document.querySelector(sel);
      if(!el){el=document.createElement("meta");if(prop)el.setAttribute("property",name);else el.setAttribute("name",name);document.head.appendChild(el);}
      el.setAttribute("content",content);
    };
    setMeta("description","Run a fan-made 2026 global football tournament simulator with all 48 teams, group stage, knockout rounds, champion odds, AI match reports, and live scores. Entertainment only. Not affiliated with FIFA.");
    setMeta("keywords","football simulator 2026, world cup simulator, 48 teams, tournament simulator, football odds");
    setMeta("robots","index,follow");
    // Add canonical link
    let link=document.querySelector("link[rel='canonical']");
    if(!link){link=document.createElement("link");link.setAttribute("rel","canonical");document.head.appendChild(link);}
    if(typeof window!=="undefined")link.setAttribute("href",window.location.origin);
    setMeta("og:title","Global Football Simulator 2026",true);
    setMeta("og:description","Simulate the 48-team tournament. Group stage, knockout rounds, champion odds. Entertainment only.",true);
    setMeta("og:type","website",true);
    setMeta("og:url",typeof window!=="undefined"?window.location.href:"",true);
    setMeta("twitter:card","summary_large_image",false);
    setMeta("twitter:title","Global Football Simulator 2026",false);
    setMeta("twitter:description","Simulate the 48-team football tournament. Entertainment only.",false);
  },[]);
  return null;
}

// ── COOKIE CONSENT BANNER ──
function CookieBanner(){
  const[accepted,setAccepted]=useState(()=>{
    try{return localStorage.getItem("gfs_cookies")==="accepted";}catch{return false;}
  });
  const[declined,setDeclined]=useState(()=>{
    try{return localStorage.getItem("gfs_cookies")==="declined";}catch{return false;}
  });
  if(accepted||declined) return null;
  return(
    <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:9999,background:T.card,borderTop:`2px solid ${T.border}`,padding:"12px 20px",display:"flex",alignItems:"center",gap:12,flexWrap:"wrap",boxShadow:"0 -4px 24px rgba(0,0,0,0.4)"}}>
      <div style={{flex:1,minWidth:200}}>
        <p style={{fontSize:11,color:T.text,margin:0,lineHeight:1.6}}>
          🍪 We use cookies for analytics (Google Analytics) and advertising (Google AdSense). Third-party vendors including Google may use cookies to serve ads based on your prior visits.
          <a href="https://adssettings.google.com" target="_blank" rel="noopener" style={{color:T.blue,marginLeft:4}}>Opt out</a>
          {" · "}
          <button onClick={()=>setAccepted(true)} style={{background:"none",border:"none",color:T.blue,fontSize:11,cursor:"pointer",padding:0}} onClickCapture={()=>{try{localStorage.setItem("gfs_cookies","accepted");}catch{}}}>
            Accept all
          </button>
          {" · "}
          <button onClick={()=>{setDeclined(true);try{localStorage.setItem("gfs_cookies","declined");}catch{}}} style={{background:"none",border:"none",color:T.muted,fontSize:11,cursor:"pointer",padding:0}}>
            Decline
          </button>
        </p>
      </div>
      <button onClick={()=>{setAccepted(true);try{localStorage.setItem("gfs_cookies","accepted");}catch{}}} style={{background:T.gradBtnGreen,border:"none",borderRadius:8,padding:"7px 16px",color:"#fff",fontWeight:700,fontSize:11,cursor:"pointer",flexShrink:0}}>
        Accept & Continue
      </button>
    </div>
  );
}

// ── ACCESSIBLE MODAL WRAPPER ──
function ModalBackdrop({onClose,title,children,zIndex=9000}){
  useEffect(()=>{
    const onKey=e=>{if(e.key==="Escape")onClose();};
    document.addEventListener("keydown",onKey);
    // Prevent body scroll
    const prev=document.body.style.overflow;
    document.body.style.overflow="hidden";
    return()=>{document.removeEventListener("keydown",onKey);document.body.style.overflow=prev;};
  },[onClose]);
  return(
    <div role="presentation" style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",zIndex,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(6px)"}}
      onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={title}
        onClick={e=>e.stopPropagation()}
        style={{width:"100%",maxWidth:540}}>
        {children}
      </div>
    </div>
  );
}

function GlobalStyles(){return(<style>{`
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:#04101e;font-family:'DM Sans',system-ui,sans-serif;color:#e2e8f0}
  ::-webkit-scrollbar{width:4px;height:4px}
  ::-webkit-scrollbar-track{background:#04101e}
  ::-webkit-scrollbar-thumb{background:#1a3a5c;border-radius:4px}
  @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
  @keyframes champPulse{0%,100%{box-shadow:0 0 40px #f59e0b22}50%{box-shadow:0 0 80px #f59e0b44}}
  @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
  .match-row:hover{background:#112550!important;border-color:#2563eb66!important;cursor:pointer}
  .team-card:hover{border-color:var(--j0)!important;box-shadow:0 8px 24px var(--j1)!important;transform:translateY(-2px)}
  .sc-btn:hover{filter:brightness(1.1)}
  .leg-btn:hover{color:#22d3ee!important}
  .mobile-only{display:none}@media(max-width:768px){.mobile-only{display:block}}
  body{padding-bottom:0}@media(max-width:768px){body{padding-bottom:68px}}
`}</style>);}

// Ad zone
function Ad({label,size,style:s}){return(
  <div style={{border:`1px dashed ${T.gold}33`,borderRadius:8,padding:"10px 16px",textAlign:"center",background:`${T.gold}05`,...s}}>
    <div style={{fontSize:8,color:`${T.gold}77`,letterSpacing:2,fontWeight:700,textTransform:"uppercase"}}>Advertisement · {label}</div>
    <div style={{fontSize:8,color:T.muted,marginTop:2}}>{size} · Insert AdSense / Mediavine / sponsor code here</div>
  </div>
);}

// Legal modal
function LegalModal({page,onClose}){
  const p=LEGAL[page];if(!p)return null;
  const lines=p.body.split('\n').map((l,i)=>{
    if(l==='')return<div key={i} style={{height:7}}/>;
    const isHead=/^[A-Z][A-Z0-9 '&,–-]+$/.test(l.trim())&&l.length<50&&l.length>2;
    if(isHead)return<div key={i} style={{fontSize:9,fontWeight:700,color:T.cyan,letterSpacing:2,marginTop:14,marginBottom:4}}>{l}</div>;
    if(l.startsWith('• '))return<div key={i} style={{fontSize:12,color:"#94a3b8",lineHeight:1.7,display:"flex",gap:6,marginBottom:2}}><span style={{color:T.green,flexShrink:0}}>▸</span>{l.slice(2)}</div>;
    return<p key={i} style={{fontSize:12,color:"#94a3b8",lineHeight:1.7,margin:0}}>{l}</p>;
  });
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:9000,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(6px)"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:T.card,borderRadius:20,maxWidth:540,width:"100%",border:`1px solid ${T.border}`,boxShadow:"0 40px 80px rgba(0,0,0,0.8)",maxHeight:"82vh",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"20px 24px 14px",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:18}}>{p.icon}</span>
            <h2 style={{margin:0,fontSize:17,fontWeight:800,background:T.gradHdr,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{p.title}</h2>
          </div>
          <button onClick={onClose} aria-label="Close modal"  style={{background:T.cardHi,border:`1px solid ${T.border}`,borderRadius:8,color:T.muted,fontSize:14,cursor:"pointer",width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
        <div style={{padding:"14px 24px 20px",overflowY:"auto",flex:1}}>{lines}</div>
        <div style={{padding:"10px 24px",borderTop:`1px solid ${T.border}`,fontSize:8,color:T.muted,textAlign:"center",flexShrink:0}}>Global Football Simulator 2026 · {DATA_VERIFIED}</div>
      </div>
    </div>
  );
}

// Team modal
function TeamModal({teamName,onClose,onPlayer}){
  const team=SQUADS[teamName];if(!team)return null;
  const byPos={GK:[],DF:[],MF:[],FW:[]};
  team.players.forEach(p=>{if(byPos[p.p])byPos[p.p].push(p);});
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",zIndex:8000,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(6px)"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:T.card,borderRadius:20,maxWidth:520,width:"100%",border:`2px solid ${team.jersey[0]}44`,boxShadow:`0 40px 80px rgba(0,0,0,0.8),0 0 60px ${team.jersey[0]}18`,maxHeight:"88vh",display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"16px 20px",background:`linear-gradient(135deg,${team.jersey[0]}28,${team.jersey[1]}10)`,borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <span style={{fontSize:32}}>{team.flag}</span>
            <div>
              <div style={{fontSize:17,fontWeight:800,color:T.text}}>{teamName}</div>
              <div style={{fontSize:10,color:T.muted}}>Coach: <span style={{color:T.text,fontWeight:600}}>{team.coach}</span> · {team.conf} · Rating <span style={{color:T.green,fontWeight:700}}>{team.rating}</span>/100</div>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close modal" style={{background:"rgba(255,255,255,0.06)",border:`1px solid ${T.border}`,borderRadius:8,color:T.muted,fontSize:14,cursor:"pointer",width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>✕</button>
        </div>
        <div style={{overflowY:"auto",padding:"14px 16px",flex:1}}>
          {Object.entries(byPos).map(([pos,pls])=>pls.length===0?null:(
            <div key={pos} style={{marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:7}}>
                <span style={{fontSize:13}}>{POS_ICON[pos]}</span>
                <span style={{fontSize:9,fontWeight:700,color:POS_COLOR[pos],letterSpacing:2}}>{pos==="GK"?"GOALKEEPERS":pos==="DF"?"DEFENDERS":pos==="MF"?"MIDFIELDERS":"FORWARDS"}</span>
                <span style={{fontSize:9,color:T.muted}}>({pls.length})</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>
                {pls.map((pl,i)=>(
                  <button key={i} onClick={()=>onPlayer(pl,teamName)} style={{background:T.cardHi,border:`1px solid ${T.border}`,borderRadius:8,padding:"6px 10px",textAlign:"left",cursor:"pointer",color:T.text,fontSize:12,display:"flex",alignItems:"center",gap:6,transition:"all 0.15s"}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=POS_COLOR[pos];e.currentTarget.style.background=POS_COLOR[pos]+"15";}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.background=T.cardHi;}}>
                    <span style={{fontSize:13,flexShrink:0}}>{POS_ICON[pos]}</span>
                    <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{pl.n}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{padding:"8px 16px",borderTop:`1px solid ${T.border}`,fontSize:8,color:T.muted,textAlign:"center",flexShrink:0}}>
          {team.players.length} players · {DATA_SOURCE}
        </div>
      </div>
    </div>
  );
}

// Player card
function PlayerCard({player,teamName,onClose}){
  const team=SQUADS[teamName]||{jersey:["#666","#888"],flag:"🏳️",coach:"",conf:"",rating:0,players:[]};
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",zIndex:9000,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(6px)"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:T.card,borderRadius:20,padding:24,maxWidth:340,width:"100%",border:`2px solid ${team.jersey[0]}55`,boxShadow:`0 30px 70px rgba(0,0,0,0.8),0 0 50px ${team.jersey[0]}20`}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:24}}>{team.flag}</span>
            <div><div style={{fontSize:10,color:T.muted}}>{team.conf}</div><div style={{fontSize:12,fontWeight:700}}>{teamName}</div></div>
          </div>
          <button onClick={onClose} aria-label="Close modal" style={{background:T.cardHi,border:`1px solid ${T.border}`,borderRadius:8,color:T.muted,fontSize:14,cursor:"pointer",width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
        <div style={{width:86,height:86,borderRadius:"50%",margin:"0 auto 14px",background:`linear-gradient(145deg,${team.jersey[0]},${team.jersey[1]})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:34,boxShadow:`0 0 40px ${team.jersey[0]}55`}}>
          {POS_ICON[player.p]||"⚽"}
        </div>
        <div style={{textAlign:"center",marginBottom:14}}>
          <div style={{fontSize:19,fontWeight:800,color:T.text,marginBottom:6}}>{player.n}</div>
          <span style={{display:"inline-block",padding:"4px 16px",borderRadius:20,background:`${POS_COLOR[player.p]}20`,color:POS_COLOR[player.p],fontSize:10,fontWeight:700,letterSpacing:1}}>{POS_LABEL[player.p]}</span>
        </div>
        <div style={{background:T.cardHi,borderRadius:10,padding:12,border:`1px solid ${T.border}`}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:10,color:T.muted}}>Coach</span><span style={{fontSize:11,fontWeight:600}}>{team.coach}</span></div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:10,color:T.muted}}>Team rating</span>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:56,height:4,background:T.border,borderRadius:2,overflow:"hidden"}}><div style={{width:team.rating+"%",height:"100%",background:T.green,borderRadius:2}}/></div>
              <span style={{fontSize:11,fontWeight:700,color:T.green}}>{team.rating}</span>
            </div>
          </div>
        </div>
        <div style={{marginTop:10,fontSize:8,color:T.muted,textAlign:"center"}}>Independent estimate · Not an official FIFA ranking</div>
      </div>
    </div>
  );
}

// AI report modal
function AIReport({match,onClose}){
  const[txt,setTxt]=useState("");const[ld,setLd]=useState(true);
  useEffect(()=>{apiReport(match).then(t=>{setTxt(t);setLd(false);});},[]);
  const t1=match.t1||match.tA,t2=match.t2||match.tB;
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",zIndex:9000,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(6px)"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:T.card,borderRadius:20,padding:24,maxWidth:500,width:"100%",border:`1px solid ${T.border}`,boxShadow:"0 40px 80px rgba(0,0,0,0.8)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:16}}>🎙️</span>
            <span style={{fontSize:11,fontWeight:800,color:T.gold,letterSpacing:1}}>AI MATCH REPORT</span>
            <span style={{fontSize:8,padding:"2px 6px",borderRadius:6,background:`${T.purple}22`,color:T.purple,fontWeight:700}}>AI-GENERATED</span>
          </div>
          <button onClick={onClose} aria-label="Close modal" style={{background:T.cardHi,border:`1px solid ${T.border}`,borderRadius:8,color:T.muted,fontSize:14,cursor:"pointer",width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
        <div style={{textAlign:"center",padding:"14px 0",borderTop:`1px solid ${T.border}`,borderBottom:`1px solid ${T.border}`,marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:16}}>
            <div><div style={{fontSize:28}}>{t1.flag}</div><div style={{fontSize:11,fontWeight:700,marginTop:2}}>{t1.name}</div></div>
            <div>
              <div style={{fontSize:26,fontWeight:900,color:T.green,fontFamily:"'JetBrains Mono',monospace",letterSpacing:3}}>{match.gA}–{match.gB}</div>
              {match.pen&&<div style={{fontSize:9,color:T.gold,marginTop:1}}>Pens {match.pA}–{match.pB}</div>}
            </div>
            <div><div style={{fontSize:28}}>{t2.flag}</div><div style={{fontSize:11,fontWeight:700,marginTop:2}}>{t2.name}</div></div>
          </div>
        </div>
        <div style={{fontSize:13,lineHeight:1.8,color:"#94a3b8",minHeight:64}}>
          {ld
          ?<span style={{color:T.muted,fontStyle:"italic",display:"flex",alignItems:"center",gap:8}}>
            <span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>⟳</span>
            Generating commentary…
          </span>
          :<span style={{lineHeight:1.8}}>{txt}</span>
        }
        </div>
        <div style={{marginTop:12,fontSize:8,color:T.muted,textAlign:"center",paddingTop:10,borderTop:`1px solid ${T.border}`}}>
          AI match reports require <code style={{background:T.cardHi,padding:"1px 4px",borderRadius:3}}>/api/match-report</code> backend · Shows fallback if unavailable · Entertainment only
        </div>
      </div>
    </div>
  );
}

// MC modal — uses r.champion (stage tracking engine output)
function MCModal({results,onClose}){
  const top=(results||[]).slice(0,12);
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",zIndex:9000,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(6px)"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:T.card,borderRadius:20,padding:22,maxWidth:520,width:"100%",border:`1px solid ${T.border}`,boxShadow:"0 40px 80px rgba(0,0,0,0.8)",maxHeight:"85vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div>
            <h3 style={{margin:0,fontSize:16,fontWeight:800,color:T.text}}>🎯 Champion Probability</h3>
            <p style={{margin:"2px 0 0",fontSize:10,color:T.muted}}>Top 12 from 1,000 independent simulations</p>
          </div>
          <button onClick={onClose} aria-label="Close modal" style={{background:T.cardHi,border:`1px solid ${T.border}`,borderRadius:8,color:T.muted,fontSize:14,cursor:"pointer",width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
        {top.map((r,i)=>{
          const pct=Number(r.champion||0);
          return(
            <div key={r.name} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,padding:"7px 10px",background:i===0?`${T.gold}10`:T.cardHi,borderRadius:8,border:`1px solid ${i===0?T.gold:T.border}`}}>
              <span style={{width:22,fontSize:11,fontWeight:800,color:i===0?T.gold:i<3?T.green:T.muted,textAlign:"center"}}>#{i+1}</span>
              <span style={{fontSize:17}}>{r.flag}</span>
              <span style={{flex:1,fontSize:13,fontWeight:600,color:T.text}}>{r.name}</span>
              <div style={{width:90,height:6,background:T.border,borderRadius:3,overflow:"hidden"}}>
                <div style={{width:`${Math.min(100,pct*3)}%`,height:"100%",background:i===0?T.gold:i<3?T.green:T.blue,borderRadius:3}}/>
              </div>
              <span style={{fontSize:12,fontWeight:800,color:i===0?T.gold:T.green,width:46,textAlign:"right"}}>{pct.toFixed(1)}%</span>
            </div>
          );
        })}
        <div style={{marginTop:10,padding:"8px 12px",background:T.cardHi,borderRadius:8,border:`1px solid ${T.border}`,fontSize:8,color:T.muted,textAlign:"center"}}>
          Independent model · Not a betting tool · Not affiliated with FIFA
        </div>
      </div>
    </div>
  );
}

// Fan Reactions
function FanReactions({to}){
  const[msgs,setMsgs]=useState([]);const[inp,setInp]=useState("");const[lang,setLang]=useState("en");const[trans,setTrans]=useState({});const[tId,setTId]=useState(null);
  const allK=Object.keys(SQUADS),lks=Object.keys(CMT);
  const mk=useCallback(()=>{
    const l=lks[Math.floor(Math.random()*lks.length)],ts=CMT[l],tp=ts[Math.floor(Math.random()*ts.length)];
    const t1=allK[Math.floor(Math.random()*allK.length)],t2=allK[Math.floor(Math.random()*allK.length)];
    return{id:Date.now()+Math.random(),u:USERS[Math.floor(Math.random()*USERS.length)],text:tp.replace(/\{t1\}/g,t1).replace(/\{t2\}/g,t2),l,lf:LANGS.find(x=>x.c===l)?.f||"🌐",time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),likes:Math.floor(Math.random()*200),isNew:true};
  },[]);
  useEffect(()=>{if(!to)return;setMsgs(Array.from({length:12},(_,i)=>({...mk(),isNew:false,time:new Date(Date.now()-i*48000).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})})));},[to]);
  useEffect(()=>{if(!to)return;const iv=setInterval(()=>setMsgs(p=>[{...mk()},...p.map(x=>({...x,isNew:false}))].slice(0,80)),3200+Math.random()*2000);return()=>clearInterval(iv);},[to]);
  const doTr=async(id,txt)=>{if(trans[id]){setTrans(p=>{const n={...p};delete n[id];return n});return;}setTId(id);const t=await apiTranslate(txt);setTrans(p=>({...p,[id]:t}));setTId(null);};
  const send=()=>{if(!inp.trim())return;setMsgs(p=>[{id:Date.now(),u:"You",text:inp,l:lang,lf:LANGS.find(x=>x.c===lang)?.f||"🌐",time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),likes:0,isUser:true},...p]);setInp("");};
  return(
    <div style={{background:T.card,borderRadius:16,border:`1px solid ${T.border}`,overflow:"hidden"}}>
      <div style={{padding:"13px 18px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:6}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:14}}>🌍</span>
          <span style={{fontSize:14,fontWeight:800}}>SIMULATED GLOBAL FAN REACTIONS</span>
          <span style={{fontSize:8,padding:"2px 7px",borderRadius:6,background:`${T.purple}22`,color:T.purple,fontWeight:700,letterSpacing:1}}>AI-GENERATED</span>
        </div>
        <span style={{fontSize:9,color:T.muted}}>{msgs.length} reactions</span>
      </div>
      <div style={{padding:"7px 14px",borderBottom:`1px solid ${T.border}`,background:`${T.gold}08`,fontSize:9,color:"#a16207"}}>
        ⚠️ AI-generated reactions for entertainment. Not real users.
      </div>
      <div style={{padding:"10px 14px",borderBottom:`1px solid ${T.border}`,display:"flex",gap:6,flexWrap:"wrap"}}>
        <select value={lang} onChange={e=>setLang(e.target.value)} style={{background:T.cardHi,border:`1px solid ${T.border}`,borderRadius:8,padding:"6px 8px",color:T.text,fontSize:11,cursor:"pointer"}}>
          {LANGS.map(l=><option key={l.c} value={l.c}>{l.f} {l.n}</option>)}
        </select>
        <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Add your reaction…" style={{flex:1,minWidth:140,background:T.cardHi,border:`1px solid ${T.border}`,borderRadius:8,padding:"6px 12px",color:T.text,fontSize:12,outline:"none"}}/>
        <button onClick={send} style={{background:T.gradBtnGreen,border:"none",borderRadius:8,padding:"6px 16px",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:12}}>Send</button>
      </div>
      <div style={{maxHeight:420,overflowY:"auto",padding:"8px 10px"}}>
        {msgs.map(m=>(
          <div key={m.id} style={{padding:"8px 10px",marginBottom:4,borderRadius:10,background:m.isUser?`${T.blue}12`:m.isNew?`${T.green}08`:T.cardHi,border:`1px solid ${m.isUser?T.blue+"55":m.isNew?T.green+"33":T.border}`,transition:"all 0.3s"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
              <span style={{fontSize:11,fontWeight:700,color:m.isUser?T.blue:T.text}}>{m.u} <span style={{opacity:.5,fontSize:9}}>{m.lf}</span></span>
              <span style={{fontSize:9,color:T.muted}}>{m.time}</span>
            </div>
            <p style={{margin:0,fontSize:12,lineHeight:1.5,color:"#94a3b8"}}>{m.text}</p>
            {trans[m.id]&&<p style={{margin:"4px 0 0",fontSize:10,color:T.muted,fontStyle:"italic",padding:"3px 8px",background:T.card,borderRadius:4,borderLeft:`2px solid ${T.green}`}}>🌐 {trans[m.id]}</p>}
            <div style={{display:"flex",gap:8,marginTop:4,alignItems:"center"}}>
              <span style={{fontSize:10,color:T.muted}}>❤️ {m.likes}</span>
              {m.l!=="en"&&<button onClick={()=>doTr(m.id,m.text)} style={{background:"none",border:`1px solid ${T.border}`,borderRadius:4,padding:"1px 7px",color:T.muted,fontSize:9,cursor:"pointer"}}>{tId===m.id?"⏳ …":trans[m.id]?"Hide":"🌐 Translate"}</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Revenue panel
function Revenue(){
  const[v,sv]=useState(500000);const[pp,spp]=useState(4);const[ap,sap]=useState(4);const[cpm,scpm]=useState(8);
  const mo=(v*pp*ap*cpm)/1000,pk=mo*1.5;
  const tiers=[
    {n:"AdSense",r:"$3 CPM · No minimum",pv:Math.round(50000/(3*pp*ap/1000)),c:T.blue},
    {n:"Journey by Mediavine",r:"$12 avg · 1K sessions",pv:Math.round(50000/(12*pp*ap/1000)),c:T.teal},
    {n:"Mediavine",r:"$20 avg · $5K annual req",pv:Math.round(50000/(20*pp*ap/1000)),c:T.green},
    {n:"Raptive / AdThrive",r:"$25 avg · 100K pv/mo",pv:Math.round(50000/(25*pp*ap/1000)),c:T.gold},
  ];
  return(
    <div style={{display:"grid",gap:12}}>
      <div style={{background:T.card,borderRadius:14,padding:20,border:`1px solid ${T.border}`}}>
        <div style={{fontSize:15,fontWeight:800,color:T.gold,marginBottom:4}}>💰 Ad Revenue Calculator</div>
        <div style={{fontSize:11,color:T.muted,marginBottom:16}}>Honest CPM benchmarks — not a prediction.</div>
        {[["Monthly Visitors",v,sv,10000,5000000,10000,x=>x>=1000000?(x/1000000).toFixed(1)+"M":x>=1000?(x/1000).toFixed(0)+"K":""+x],["Pages per Visit",pp,spp,1,10,1,x=>x],["Ads per Page",ap,sap,1,6,1,x=>x],["CPM (US$)",cpm,scpm,1,35,1,x=>`$${x}`]].map(([l,val,set,mn,mx,st,fmt])=>(
          <div key={l} style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:T.muted,marginBottom:4}}><span>{l}</span><span style={{fontWeight:700,color:T.text,fontFamily:"'JetBrains Mono',monospace"}}>{fmt(val)}</span></div>
            <input type="range" min={mn} max={mx} step={st} value={val} onChange={e=>set(+e.target.value)} style={{width:"100%",accentColor:T.green,height:4}}/>
          </div>
        ))}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:16}}>
          <div style={{background:T.cardHi,borderRadius:10,padding:14,textAlign:"center",border:`1px solid ${mo>=50000?T.green:T.border}`}}>
            <div style={{fontSize:8,color:T.muted,letterSpacing:1,marginBottom:4}}>MONTHLY ESTIMATE</div>
            <div style={{fontSize:22,fontWeight:900,color:mo>=50000?T.green:T.gold,fontFamily:"'JetBrains Mono',monospace"}}>${Math.round(mo).toLocaleString()}</div>
          </div>
          <div style={{background:T.cardHi,borderRadius:10,padding:14,textAlign:"center",border:`1px solid ${T.border}`}}>
            <div style={{fontSize:8,color:T.muted,letterSpacing:1,marginBottom:4}}>PEAK ×1.5 (TOURNAMENT)</div>
            <div style={{fontSize:22,fontWeight:900,color:T.blue,fontFamily:"'JetBrains Mono',monospace"}}>${Math.round(pk).toLocaleString()}</div>
          </div>
        </div>
      </div>
      <div style={{background:T.card,borderRadius:14,padding:20,border:`1px solid ${T.border}`}}>
        <div style={{fontSize:13,fontWeight:700,marginBottom:12}}>Reaching $50K/month requires:</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:8,marginBottom:16}}>
          {tiers.map(tier=>(
            <div key={tier.n} style={{background:T.cardHi,borderRadius:10,padding:12,border:`1px solid ${T.border}`}}>
              <div style={{fontSize:11,fontWeight:700,color:tier.c,marginBottom:4}}>{tier.n}</div>
              <div style={{fontSize:9,color:T.muted,marginBottom:6}}>{tier.r}</div>
              <div style={{fontSize:13,fontWeight:800}}>{tier.pv.toLocaleString()} pv/mo</div>
              <div style={{fontSize:9,color:T.muted}}>≈ {Math.round(tier.pv/pp).toLocaleString()} visitors</div>
            </div>
          ))}
        </div>
        <div style={{padding:12,background:`${T.green}08`,borderRadius:8,border:`1px solid ${T.green}22`,fontSize:11,color:T.muted,lineHeight:1.7}}>
          <strong style={{color:T.green}}>Realistic range for this tool:</strong><br/>
          Pre-tournament: <strong style={{color:T.text}}>$200–1K</strong> · Peak tournament if viral: <strong style={{color:T.text}}>$2K–15K</strong><br/>
          $50K/month requires sustained traffic + sponsors + premium ad network + email list.
        </div>
      </div>
    </div>
  );
}

// Squads panel
function SquadsPanel({onTeam}){
  const[q,setQ]=useState("");const[conf,setConf]=useState("All");
  const confs=["All","UEFA","CONMEBOL","CONCACAF","CAF","AFC","OFC"];
  const items=Object.entries(SQUADS).filter(([n,d])=>{
    const mc=conf==="All"||d.conf===conf;
    const ms=!q||n.toLowerCase().includes(q.toLowerCase())||d.players.some(p=>p.n.toLowerCase().includes(q.toLowerCase()));
    return mc&&ms;
  });
  return(
    <div>
      <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap",alignItems:"center"}}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search team or player…" style={{flex:"1 1 180px",background:T.card,border:`1px solid ${T.border}`,borderRadius:8,padding:"8px 12px",color:T.text,fontSize:12,outline:"none"}}/>
        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
          {confs.map(c=><button key={c} onClick={()=>setConf(c)} style={{padding:"6px 12px",borderRadius:8,border:`1px solid ${conf===c?T.green:T.border}`,background:conf===c?`${T.green}12`:T.card,color:conf===c?T.green:T.muted,fontSize:10,fontWeight:conf===c?700:400,cursor:"pointer"}}>{c}</button>)}
        </div>
      </div>
      <div style={{fontSize:10,color:T.muted,marginBottom:8}}>
        {items.length} teams · {AUDIT.tot} players · {DATA_SOURCE}
      </div>
      <div style={{marginBottom:10,padding:"8px 12px",background:`${T.blue}08`,border:`1px solid ${T.blue}22`,borderRadius:8,fontSize:9,color:T.muted,lineHeight:1.7}}>
        <strong style={{color:T.text}}>📊 About team ratings:</strong> Independent model estimates (not FIFA rankings). Combine recent form, squad depth, tournament history, confederation strength, and manual balancing for entertainment realism.
        Confidence: <span style={{color:T.green}}>High</span> (major nations with stable squads) · <span style={{color:T.gold}}>Medium</span> (mid-tier) · <span style={{color:T.red}}>Lower</span> (debuts/limited data).
        All ratings affect Poisson xG simulation only — not predictions.
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(272px,1fr))",gap:8}}>
        {items.map(([name,team])=>(
          <div key={name} className="team-card" onClick={()=>onTeam(name)}
            style={{"--j0":team.jersey[0]+"77","--j1":team.jersey[0]+"15",background:T.card,borderRadius:12,overflow:"hidden",border:`1px solid ${T.border}`,cursor:"pointer",transition:"all 0.2s"}}>
            <div style={{padding:"10px 12px",display:"flex",alignItems:"center",gap:10,borderBottom:`1px solid ${T.border}`,background:`linear-gradient(135deg,${team.jersey[0]}20,${team.jersey[1]}08)`}}>
              <span style={{fontSize:22}}>{team.flag}</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:700}}>{name}</div>
                <div style={{fontSize:9,color:T.muted}}>Coach: {team.coach} · {team.conf}</div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontSize:14,fontWeight:800,color:T.green}}>{team.rating}</div>
                <div style={{fontSize:7,color:T.muted}}>rating</div>
              </div>
            </div>
            <div style={{padding:"8px 10px"}}>
              <div style={{display:"flex",gap:3,marginBottom:5}}>
                {["GK","DF","MF","FW"].map(p=>{const ct=team.players.filter(x=>x.p===p).length;return(<span key={p} style={{padding:"2px 6px",borderRadius:4,background:`${POS_COLOR[p]}14`,color:POS_COLOR[p],fontSize:9,fontWeight:700}}>{p} {ct}</span>);})}
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:2}}>
                {team.players.slice(0,7).map((pl,i)=><span key={i} style={{fontSize:9,color:T.muted,background:T.cardHi,borderRadius:3,padding:"1px 4px"}}>{pl.n.split(" ").slice(-1)[0]}</span>)}
                {team.players.length>7&&<span style={{fontSize:9,color:T.muted}}>+{team.players.length-7}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}




// ── DATA STATUS BAR ──
function DataStatusBar({lastFetch,error,liveData}){
  const lockedCount=Object.values(RESULT_STATE.byMatchId||{}).filter(x=>x.locked).length;
  const manualCount=Object.values(RESULT_STATE.byMatchId||{}).filter(x=>x.source?.startsWith("Verified")).length;
  const liveNow=Object.values(liveData||{}).filter(m=>m.status==="in").length;
  const fresh=lastFetch&&Date.now()-new Date(lastFetch).getTime()<2*60*1000;
  return(
    <div style={{padding:"8px 14px",borderRadius:10,
      background:error?`${T.orange}10`:(lockedCount>0)?`${T.green}08`:T.cardHi,
      border:`1px solid ${error?T.orange:(lockedCount>0)?T.green:T.border}`,
      fontSize:10,marginBottom:10,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
      <div style={{display:"flex",alignItems:"center",gap:6,flex:1,minWidth:200}}>
        {liveNow>0&&<span style={{width:7,height:7,borderRadius:"50%",background:T.red,animation:"champPulse 1.5s infinite",display:"inline-block",flexShrink:0}}/>}
        <span style={{color:error?T.orange:(lockedCount>0)?T.green:T.muted,fontWeight:700}}>
          {error?"⚠️ Live data delayed — using verified saved results"
           :(liveNow>0)?("🔴 "+liveNow+" match"+(liveNow>1?"es":"")+" LIVE")
           :"✅ Live Official Mode"}
        </span>
      </div>
      <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
        <span style={{fontSize:9,color:T.green,fontWeight:700}}>🔒 {lockedCount}/104 locked</span>
        {manualCount>0&&<span style={{fontSize:8,color:T.muted}}>({manualCount} verified manual)</span>}
        <span style={{fontSize:8,color:T.muted}}>Source: Verified + ESPN</span>
        {lastFetch
          ?<span style={{fontSize:8,color:T.muted}}>Checked {new Date(lastFetch).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</span>
          :<span style={{fontSize:8,color:T.orange}}>Not yet checked</span>}
      </div>
    </div>
  );
}

// ── MATCH BADGE helper ──
function MatchBadge({locked,source}){
  if(locked) return <span style={{fontSize:7,padding:"1px 5px",borderRadius:3,background:`${T.green}22`,color:T.green,fontWeight:700,flexShrink:0}}>🔒</span>;
  return <span style={{fontSize:7,padding:"1px 5px",borderRadius:3,background:`${T.purple}20`,color:T.purple,flexShrink:0}}>🎲</span>;
}

// ── LIVE SCORE BAR ──
function LiveBar({liveData,lastFetch,loading,error}){
  const liveMatches=Object.values(liveData).filter(m=>m.status==="in");
  const recentMatches=Object.values(liveData).filter(m=>m.status==="post").slice(-4);
  const all=[...liveMatches,...recentMatches].slice(0,8);
  if(all.length===0&&!loading) return null;
  return(
    <div style={{background:T.cardHi,borderRadius:10,padding:"8px 14px",marginBottom:10,border:`1px solid ${liveMatches.length>0?T.green+"44":T.border}`,overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,minWidth:"max-content"}}>
        <div style={{display:"flex",alignItems:"center",gap:5,flexShrink:0}}>
          {liveMatches.length>0&&<span style={{width:6,height:6,borderRadius:"50%",background:T.red,animation:"champPulse 1.5s infinite",display:"inline-block"}}/>}
          <span style={{fontSize:9,fontWeight:700,color:liveMatches.length>0?T.green:T.muted,letterSpacing:1}}>
            {loading?"UPDATING…":liveMatches.length>0?`${liveMatches.length} LIVE`:"RECENT"}
          </span>
          {lastFetch&&<span style={{fontSize:8,color:T.muted}}>{lastFetch.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</span>}
          {error&&<span style={{fontSize:8,color:T.orange}}>⚠️ {error}</span>}
        </div>
        <div style={{width:1,height:14,background:T.border,flexShrink:0}}/>
        {all.length===0&&loading&&<span style={{fontSize:10,color:T.muted}}>Fetching live scores…</span>}
        {all.map(m=>(
          <div key={m.id} style={{display:"flex",alignItems:"center",gap:5,padding:"3px 8px",background:m.status==="in"?`${T.green}12`:T.card,borderRadius:6,border:`1px solid ${m.status==="in"?T.green+"33":T.border}`,flexShrink:0}}>
            <span style={{fontSize:11}}>{SQUADS[m.t1]?.flag||"🏳️"}</span>
            <span style={{fontSize:10,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",color:T.scoreTxt,background:T.scoreBg,padding:"1px 5px",borderRadius:3}}>{m.s1}–{m.s2}</span>
            <span style={{fontSize:11}}>{SQUADS[m.t2]?.flag||"🏳️"}</span>
            {m.status==="in"&&<span style={{fontSize:8,color:T.green,fontWeight:700}}>{m.clock}′</span>}
            {m.status==="post"&&<span style={{fontSize:7,color:T.muted}}>FT</span>}
          </div>
        ))}
        {all.length===0&&!loading&&<span style={{fontSize:10,color:T.muted}}>No matches today — check back on match days</span>}
      </div>
    </div>
  );
}

// ── MATCH ROW & KO LIST (top-level to avoid React render issues) ──
function MatchRow({m, onClick}){
  const t1=m.t1||m.tA, t2=m.t2||m.tB;
  const isLocked=m.locked===true;
  return(
    <div className="match-row" onClick={()=>onClick&&onClick(m)}
      style={{display:"flex",alignItems:"center",gap:5,padding:"7px 10px",
        background:isLocked?`${T.green}07`:T.card,
        borderRadius:7,border:`1px solid ${isLocked?T.green+"33":T.border}`,
        transition:"all 0.15s",marginBottom:4}}>
      <MatchBadge locked={isLocked} source={m.source}/>
      <span style={{fontWeight:m.w?.name===t1?.name?700:400,opacity:m.w?.name===t1?.name?1:.35,flex:1,textAlign:"right",fontSize:11,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t1?.flag} {t1?.name}</span>
      <div style={{flexShrink:0,textAlign:"center",minWidth:54}}>
        <span style={{fontWeight:900,padding:"2px 8px",borderRadius:5,background:T.scoreBg,color:T.scoreTxt,fontSize:13,fontFamily:"'JetBrains Mono',monospace",letterSpacing:1}}>{m.gA}–{m.gB}</span>
        {m.pen&&<div style={{fontSize:7,color:T.gold,marginTop:1}}>P {m.pA}–{m.pB}</div>}
      </div>
      <span style={{fontWeight:m.w?.name===t2?.name?700:400,opacity:m.w?.name===t2?.name?1:.35,flex:1,fontSize:11,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t2?.name} {t2?.flag}</span>
      {onClick&&<span style={{fontSize:8,color:`${T.muted}99`,flexShrink:0}}>🎙️</span>}
    </div>
  );
}

function KOList({ms, title, note, onReport}){
  return(
    <div>
      {title&&<div style={{fontSize:10,fontWeight:700,color:T.muted,letterSpacing:2,marginBottom:8,textTransform:"uppercase"}}>{title}</div>}
      {note&&<div style={{fontSize:9,color:T.muted,marginBottom:10,padding:"6px 12px",background:T.cardHi,borderRadius:7,border:`1px solid ${T.border}`,display:"flex",gap:6,alignItems:"center"}}><span style={{flexShrink:0}}>ℹ️</span>{note}</div>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(262px,1fr))",gap:4}}>
        {(ms||[]).map((m,i)=><MatchRow key={i} m={m} onClick={onReport}/>)}
      </div>
    </div>
  );
}


// ── TEAM PATH PANEL ──
function TeamPathPanel({teamName, tournament, onReport, onTeam}){
  if(!teamName) return(
    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:32,textAlign:"center"}}>
      <div style={{fontSize:40,marginBottom:12}}>⭐</div>
      <p style={{fontSize:15,fontWeight:700,color:T.text,marginBottom:6}}>Choose your favourite team above</p>
      <p style={{fontSize:11,color:T.muted}}>See their complete simulated journey through the tournament — group matches, knockout path, and whether they lift the trophy.</p>
    </div>
  );
  if(!tournament) return(
    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:32,textAlign:"center"}}>
      <div style={{fontSize:40,marginBottom:12}}>{SQUADS[teamName]?.flag||"⚽"}</div>
      <p style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:6}}>Run a simulation first</p>
      <p style={{fontSize:11,color:T.muted}}>Hit "Run Tournament Simulation" to see {teamName}'s tournament path.</p>
    </div>
  );

  const team=SQUADS[teamName];
  const groupEntry=Object.entries(tournament.gr).find(([,d])=>d.standings.some(t=>t.name===teamName));
  if(!groupEntry) return <div style={{color:T.red,padding:20}}>Team not found in simulation.</div>;

  const[groupName,groupData]=groupEntry;
  const standing=groupData.standings.find(t=>t.name===teamName);
  const groupPos=groupData.standings.indexOf(standing)+1;
  const groupMatches=groupData.matches.filter(m=>m.tA.name===teamName||m.tB.name===teamName);

  const ROUND_LABELS=[
    ["Round of 32",tournament.r32],
    ["Round of 16",tournament.r16],
    ["Quarter-Final",tournament.qf],
    ["Semi-Final",tournament.sf],
    ["Final",[tournament.fin]],
    ["3rd Place",[tournament.trd]],
  ];
  const path=ROUND_LABELS.map(([round,matches])=>{
    const m=(matches||[]).find(x=>x.t1?.name===teamName||x.t2?.name===teamName);
    if(!m) return null;
    const won=m.w?.name===teamName;
    const opp=m.t1?.name===teamName?m.t2:m.t1;
    return{round,m,won,opp};
  }).filter(Boolean);

  const qualified=tournament.qualifiedNames?.includes(teamName)||false;
  const eliminated=path.find(x=>!x.won&&x.round!=="3rd Place"&&x.round!=="Semi-Final");
  const champion=tournament.fin.w?.name===teamName;
  const thirdPlace=tournament.trd.w?.name===teamName;

  const outcomeColor=champion?T.gold:thirdPlace?T.teal:eliminated?T.red:T.green;
  const lostSF=path.find(x=>x.round==="Semi-Final"&&!x.won);
  const won3rd=path.find(x=>x.round==="3rd Place"&&x.won);
  const lost3rd=path.find(x=>x.round==="3rd Place"&&!x.won);
  const outcomeText=
    champion?"🏆 Champions in this simulation!":
    won3rd?"🥉 Lost the Semi-Final — Won the 3rd Place play-off":
    lost3rd?"4th place — Lost the Semi-Final and 3rd Place play-off":
    eliminated?`Eliminated in the ${eliminated.round} by ${eliminated.opp?.flag||""} ${eliminated.opp?.name}`:
    !qualified?"❌ Eliminated in the group stage — did not qualify for knockout":
    "⏳ Still progressing in this simulation";


  return(
    <div style={{display:"grid",gap:10}}>
      {/* Header */}
      <div style={{background:`linear-gradient(135deg,${team?.jersey[0]||T.border}22,${team?.jersey[1]||T.cardHi}08)`,border:`1px solid ${team?.jersey[0]||T.border}44`,borderRadius:16,padding:18}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
          <span style={{fontSize:34}}>{team?.flag||"🏳️"}</span>
          <div>
            <div style={{fontSize:18,fontWeight:900,color:T.text}}>{teamName}</div>
            <div style={{fontSize:10,color:T.muted}}>Coach: {team?.coach} · {team?.conf} · Rating {team?.rating}/100</div>
          </div>
        </div>
        <div style={{padding:"8px 14px",borderRadius:8,background:`${outcomeColor}15`,border:`1px solid ${outcomeColor}33`,fontSize:13,fontWeight:700,color:outcomeColor}}>
          {outcomeText}
        </div>
      </div>

      {/* Group stage */}
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden"}}>
        <div style={{padding:"10px 16px",borderBottom:`1px solid ${T.border}`,background:T.cardHi,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:11,fontWeight:700,letterSpacing:1,background:T.gradHdr,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>GROUP {groupName} — POSITION {groupPos}</span>
          <span style={{fontSize:10,color:groupPos<=2?T.green:groupPos===3?T.gold:T.red,fontWeight:700}}>
            {standing.pts} pts · GD {standing.gd>0?"+":""}{standing.gd} · {standing.w}W {standing.d}D {standing.l}L
              · <span style={{color:qualified?T.green:T.red,fontWeight:700}}>{qualified?"✅ Advanced to R32":"❌ Eliminated"}</span>
          </span>
        </div>
        <div style={{padding:"8px 12px"}}>
          {groupMatches.map((m,i)=>{
            const isHome=m.tA.name===teamName;
            const opp=isHome?m.tB:m.tA;
            const gFor=isHome?m.gA:m.gB,gAg=isHome?m.gB:m.gA;
            const result=gFor>gAg?"W":gFor<gAg?"L":"D";
            const rc={W:T.green,D:T.gold,L:T.red}[result];
            return(
              <div key={i} onClick={()=>onReport&&onReport({...m,t1:m.tA,t2:m.tB})} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 8px",marginBottom:3,borderRadius:7,background:T.cardHi,border:`1px solid ${T.border}`,cursor:"pointer",transition:"all 0.15s"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor=T.borderGlow}
                onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
                <span style={{width:22,height:22,borderRadius:4,background:`${rc}20`,color:rc,fontSize:10,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{result}</span>
                <span style={{fontSize:14,flexShrink:0}}>{opp.flag}</span>
                <span style={{flex:1,fontSize:11,fontWeight:600}}>{opp.name}</span>
                <span style={{fontSize:12,fontWeight:900,fontFamily:"'JetBrains Mono',monospace",color:T.scoreTxt,background:T.scoreBg,padding:"2px 8px",borderRadius:4}}>{gFor}–{gAg}</span>
                <span style={{fontSize:8,color:T.muted}}>🎙️</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Knockout path */}
      {path.length>0&&<div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden"}}>
        <div style={{padding:"10px 16px",borderBottom:`1px solid ${T.border}`,background:T.cardHi}}>
          <span style={{fontSize:11,fontWeight:700,letterSpacing:1,background:T.gradHdr,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>KNOCKOUT JOURNEY</span>
        </div>
        <div style={{padding:"8px 12px"}}>
          {path.map((p,i)=>(
            <div key={i} onClick={()=>onReport&&onReport(p.m)} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",marginBottom:5,borderRadius:8,background:p.won?`${T.green}10`:`${T.red}10`,border:`1px solid ${p.won?T.green:T.red}33`,cursor:"pointer",transition:"all 0.15s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor=p.won?T.green:T.red}
              onMouseLeave={e=>e.currentTarget.style.borderColor=p.won?`${T.green}33`:`${T.red}33`}>
              <div style={{width:8,height:8,borderRadius:"50%",background:p.won?T.green:T.red,flexShrink:0}}/>
              <div style={{flex:1}}>
                <span style={{fontSize:9,color:T.muted,display:"block",letterSpacing:1,textTransform:"uppercase"}}>{p.round}</span>
                <span style={{fontSize:12,fontWeight:700,color:T.text}}>vs {p.opp?.flag} {p.opp?.name}</span>
              </div>
              <span style={{fontSize:12,fontWeight:900,fontFamily:"'JetBrains Mono',monospace",color:T.scoreTxt,background:T.scoreBg,padding:"2px 8px",borderRadius:4}}>{p.m.gA}–{p.m.gB}</span>
              <span style={{fontSize:11,fontWeight:700,color:p.won?T.green:T.red}}>{p.won?"Won":"Lost"}</span>
              <span style={{fontSize:8,color:T.muted}}>🎙️</span>
            </div>
          ))}
        </div>
      </div>}
    </div>
  );
}

// ── STAGE ODDS PANEL ──
function StageOddsPanel({results, running, prog, onRun, onModeChange}){
  const[filter,setFilter]=useState("");
  if(!results&&!running) return(
    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:32,textAlign:"center"}}>
      <div style={{fontSize:40,marginBottom:12}}>🎯</div>
      <p style={{fontSize:15,fontWeight:700,color:T.text,marginBottom:6}}>Stage-by-Stage Champion Probability</p>
      <p style={{fontSize:11,color:T.muted,marginBottom:16}}>All 48 teams · R32 through Champion · requestAnimationFrame keeps UI smooth even on older phones.</p>
      <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:16,flexWrap:"wrap"}}>
        {[["⚡ 250 Fast (mobile)","fast"],["🎯 1,000 Standard","standard"],["🔬 5,000 Deep","deep"]].map(([l,m])=>(
          <button key={m} onClick={()=>onModeChange&&onModeChange(m)} style={{padding:"6px 14px",borderRadius:8,border:`1px solid ${T.border}`,background:T.cardHi,color:T.muted,fontSize:10,cursor:"pointer"}}>{l}</button>
        ))}
      </div>
      <button onClick={onRun} style={{background:T.gradBtnPurple,border:"none",borderRadius:12,padding:"12px 28px",color:"#fff",fontWeight:800,fontSize:14,cursor:"pointer",boxShadow:`0 4px 20px ${T.purple}30`}}>
        🎯 Run Simulations
      </button>
    </div>
  );
  if(running) return(
    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:32,textAlign:"center"}}>
      <div style={{fontSize:40,marginBottom:10}}>⚙️</div>
      <p style={{fontSize:14,fontWeight:700,marginBottom:8}}>Running {prog}% complete…</p>
      <div style={{width:"100%",height:8,background:T.border,borderRadius:4,overflow:"hidden",maxWidth:300,margin:"0 auto"}}>
        <div style={{width:`${prog}%`,height:"100%",background:T.gradBtnPurple,borderRadius:4,transition:"width 0.3s"}}/>
      </div>
      <p style={{fontSize:10,color:T.muted,marginTop:8}}>Async chunked · requestAnimationFrame · UI stays responsive</p>
    </div>
  );
  const items=(results||[]).filter(r=>r&&r.name&&(!filter||r.name.toLowerCase().includes(filter.toLowerCase())||r.flag.includes(filter)));
  return(
    <div>
      <div style={{display:"flex",gap:8,marginBottom:10,alignItems:"center",flexWrap:"wrap"}}>
        <input value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Filter by team…"
          style={{flex:1,minWidth:140,background:T.card,border:`1px solid ${T.border}`,borderRadius:8,padding:"7px 12px",color:T.text,fontSize:12,outline:"none"}}/>
        <button onClick={onRun} style={{background:"transparent",border:`1px solid ${T.border}`,borderRadius:8,padding:"7px 14px",color:T.muted,fontSize:11,cursor:"pointer"}}>🔄 Re-run</button>
      </div>
      {/* Scrollable table for mobile */}
      <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
      <div style={{minWidth:660}}>
      {/* Header row */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 78px 78px 78px 78px 78px 78px",gap:2,padding:"5px 10px",marginBottom:4}}>
        {["Team","R32","R16","QF","SF","Final","🏆"].map((h,i)=>(
          <span key={h} style={{fontSize:9,fontWeight:700,color:T.muted,textAlign:i===0?"left":"center",letterSpacing:1}}>{h}</span>
        ))}
      </div>
      <div style={{display:"grid",gap:3}}>
        {items.map((r,i)=>{
          const tier=r.champion>=15?"#f59e0b":r.champion>=5?"#10b981":r.champion>=1?"#3b82f6":"#64748b";
          return(
            <div key={r.name} style={{display:"grid",gridTemplateColumns:"1fr 78px 78px 78px 78px 78px 78px",gap:2,padding:"7px 10px",background:i===0?`${T.gold}10`:T.card,borderRadius:8,border:`1px solid ${i===0?T.gold:T.border}`,alignItems:"center"}}>
              <div style={{display:"flex",alignItems:"center",gap:6,minWidth:0}}>
                <span style={{fontSize:9,fontWeight:700,color:tier,width:20,textAlign:"center",flexShrink:0}}>#{i+1}</span>
                <span style={{fontSize:14,flexShrink:0}}>{r.flag}</span>
                <span style={{fontSize:11,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.name}</span>
              </div>
              {[r.r32,r.r16,r.qf,r.sf,r.final,r.champion].map((v,j)=>{
                const maxV=[100,80,60,40,20,10][j];
                const pct=Math.min(100,(v/maxV)*100);
                const col=j===5?T.gold:j>=3?T.green:T.blue;
                return(
                  <div key={j} style={{textAlign:"center"}}>
                    <div style={{fontSize:11,fontWeight:700,color:(v>0)?col:T.muted}}>{v}%</div>
                    <div style={{height:3,background:T.border,borderRadius:2,overflow:"hidden",marginTop:2}}>
                      <div style={{width:`${pct}%`,height:"100%",background:col,borderRadius:2}}/>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      </div>{/* end minWidth */}
      </div>{/* end overflowX */}
      <div style={{marginTop:10,padding:"8px 12px",background:T.cardHi,borderRadius:8,border:`1px solid ${T.border}`,fontSize:8,color:T.muted,textAlign:"center"}}>
        Based on 1,000 simulations · Poisson xG model · Independent ratings · Not a betting tool · Not affiliated with FIFA
      </div>
    </div>
  );
}


// ── LIVE SCORES FULL TAB ──
function LiveScoresTab({liveData,loading,error,lastFetch,onRefresh}){
  const matches=Object.values(liveData).sort((a,b)=>new Date(a.date)-new Date(b.date));
  const live=matches.filter(m=>m.status==="in");
  const completed=matches.filter(m=>m.status==="post");
  const upcoming=matches.filter(m=>m.status==="pre");

  const MatchTile=({m,highlight})=>{
    const t1sq=SQUADS[m.t1]||{};const t2sq=SQUADS[m.t2]||{};
    const isLive=m.status==="in";const isDone=m.status==="post";
    return(
      <div style={{background:T.card,borderRadius:10,padding:"12px 14px",border:`1px solid ${isLive?T.green+"55":T.border}`,boxShadow:isLive?`0 0 16px ${T.green}15`:"none"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <span style={{fontSize:8,fontWeight:700,color:isLive?T.green:isDone?T.muted:T.blue,letterSpacing:1,textTransform:"uppercase"}}>
            {isLive?`🔴 LIVE ${m.clock}'`:isDone?"✅ FINAL":"🕐 "+new Date(m.date).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}
          </span>
          {isLive&&<span style={{fontSize:8,color:T.muted}}>{m.detail}</span>}
          {isDone&&<span style={{fontSize:8,padding:"1px 6px",borderRadius:4,background:`${T.green}15`,color:T.green}}>🔒 Locked into sim</span>}
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
          <div style={{flex:1,textAlign:"center"}}>
            <div style={{fontSize:22,marginBottom:2}}>{t1sq.flag||"🏳️"}</div>
            <div style={{fontSize:11,fontWeight:700,color:T.text}}>{m.t1}</div>
            <div style={{fontSize:8,color:T.muted}}>{t1sq.conf||""}</div>
          </div>
          <div style={{textAlign:"center",padding:"6px 12px",background:T.scoreBg,borderRadius:8,minWidth:60}}>
            {(isLive||isDone)?
              <div style={{fontSize:22,fontWeight:900,fontFamily:"'JetBrains Mono',monospace",color:T.scoreTxt,letterSpacing:2}}>{m.s1}–{m.s2}</div>:
              <div style={{fontSize:12,color:T.muted}}>vs</div>
            }
          </div>
          <div style={{flex:1,textAlign:"center"}}>
            <div style={{fontSize:22,marginBottom:2}}>{t2sq.flag||"🏳️"}</div>
            <div style={{fontSize:11,fontWeight:700,color:T.text}}>{m.t2}</div>
            <div style={{fontSize:8,color:T.muted}}>{t2sq.conf||""}</div>
          </div>
        </div>
      </div>
    );
  };

  return(
    <div>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12,flexWrap:"wrap",gap:8}}>
        <div>
          <h3 style={{margin:0,fontSize:15,fontWeight:800,color:T.text}}>🔴 Live Tournament Scores</h3>
          <p style={{margin:"2px 0 0",fontSize:10,color:T.muted}}>
            Source: ESPN public API · Auto-refreshes every 60s · {lastFetch?"Last updated "+lastFetch.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"Not yet loaded"}
          </p>
        </div>
        <button onClick={onRefresh} disabled={loading} style={{background:loading?"rgba(255,255,255,0.04)":T.gradBtnGreen,border:`1px solid ${loading?T.border:T.green}`,borderRadius:8,padding:"7px 16px",color:loading?T.muted:"#fff",fontWeight:700,fontSize:11,cursor:loading?"wait":"pointer"}}>
          {loading?"⏳ Updating…":"🔄 Refresh"}
        </button>
      </div>

      {error&&<div style={{padding:"8px 12px",background:`${T.orange}12`,border:`1px solid ${T.orange}33`,borderRadius:8,fontSize:10,color:T.orange,marginBottom:10}}>
        ⚠️ ESPN API error: {error}. Scores may be unavailable — check back on match days. Simulator will use Poisson model for all matches.
      </div>}

      {/* Live now */}
      {live.length>0&&<>
        <div style={{fontSize:9,fontWeight:700,color:T.green,letterSpacing:2,marginBottom:6,display:"flex",alignItems:"center",gap:6}}>
          <span style={{width:6,height:6,borderRadius:"50%",background:T.red,display:"inline-block",animation:"champPulse 1.5s infinite"}}/>LIVE NOW
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:8,marginBottom:14}}>
          {live.map(m=><MatchTile key={m.id} m={m}/>)}
        </div>
      </>}

      {/* Completed */}
      {completed.length>0&&<>
        <div style={{fontSize:9,fontWeight:700,color:T.muted,letterSpacing:2,marginBottom:6}}>🔒 COMPLETED — LOCKED INTO SIMULATION</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:8,marginBottom:14}}>
          {completed.map(m=><MatchTile key={m.id} m={m}/>)}
        </div>
      </>}

      {/* Upcoming */}
      {upcoming.length>0&&<>
        <div style={{fontSize:9,fontWeight:700,color:T.blue,letterSpacing:2,marginBottom:6}}>🕐 UPCOMING</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:8,marginBottom:14}}>
          {upcoming.map(m=><MatchTile key={m.id} m={m}/>)}
        </div>
      </>}

      {matches.length===0&&!loading&&<div style={{textAlign:"center",padding:"40px 20px",color:T.muted}}>
        <div style={{fontSize:40,marginBottom:12}}>📡</div>
        <p style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:6}}>No matches found yet</p>
        <p style={{fontSize:11,marginBottom:4}}>ESPN scores update automatically on match days (June 12 – July 19, 2026).</p>
        <p style={{fontSize:10}}>Between match days this will show recent results. Hit Refresh to check for updates.</p>
      </div>}

      <div style={{marginTop:12,padding:"10px 14px",background:T.cardHi,borderRadius:8,border:`1px solid ${T.border}`,fontSize:9,color:T.muted,lineHeight:1.7}}>
        <strong style={{color:T.text}}>How live data works:</strong> Completed matches are locked as real facts and used directly in simulations. 
        Completed matches are locked as real results. Live matches are shown for tracking — only final whistle scores are locked. Upcoming matches use the Poisson xG model with team ratings and your scenario. 
        Eliminated teams cannot re-enter. Data from ESPN public API — free, no API key required, refreshes every 60 seconds when the tab is visible.
        <br/><span style={{color:T.orange}}>⚠️ Live score overlay is experimental and may lag official sources. Not affiliated with ESPN, FIFA, or any official body. For entertainment only. Squad changes due to injury may occur up to 24 hours before a team's first match.</span>
      </div>
    </div>
  );
}

// ── MAIN APP ──
export default function App(){
  const[sc,setSc]=useState(SCENARIOS[0]);
  const[to,setTo]=useState(null);
  const[tab,setTab]=useState("groups");
  const[running,setRunning]=useState(false);
  const[simN,setSimN]=useState(0);
  const[narMatch,setNarMatch]=useState(null);
  const[viewTeam,setViewTeam]=useState(null);
  const[viewPlayer,setViewPlayer]=useState(null);
  const[mcRes,setMcRes]=useState(null);
  const[mcProg,setMcProg]=useState(0);
  const[mcRunning,setMcRunning]=useState(false);
  const mcCancelRef=useRef(false);
  const isMobile=typeof window!=="undefined"&&window.innerWidth<768;
  const[mcMode,setMcMode]=useState(()=>typeof window!=="undefined"&&window.innerWidth<768?"fast":"standard");
  const MC_COUNTS={fast:250,standard:1000,deep:5000};
  const[copied,setCopied]=useState(false);
  const[legalPage,setLegalPage]=useState(null);
  const[expandedG,setExpandedG]=useState({});
  const[favTeam,setFavTeam]=useState(()=>{try{return localStorage.getItem("gfs_favTeam")||"";}catch{return "";}});

  useEffect(()=>{try{if(favTeam)localStorage.setItem("gfs_favTeam",favTeam);}catch{};},[favTeam]);

  // ── LIVE SCORES (proper React state — triggers re-render on update) ──
  const[liveData,setLiveData]=useState({});
  const[liveLastFetch,setLiveLastFetch]=useState(null);
  const[liveFetching,setLiveFetching]=useState(false);
  const[liveError,setLiveError]=useState(null);

  const doLiveFetch=useCallback(async()=>{
    setLiveFetching(true);
    const data=await fetchLiveScores();
    if(data){
      // Snapshot into React state so UI re-renders
      setLiveData({...LIVE_STATE.matches});
      setLiveLastFetch(new Date(LIVE_STATE.lastFetch));
      setLiveError(null);
    } else {
      setLiveError(LIVE_STATE.error||"Live scores unavailable");
    }
    setLiveFetching(false);
  },[]);

  useEffect(()=>{
    let alive=true;
    const poll=async()=>{ if(alive) await doLiveFetch(); };
    poll();
    const id=setInterval(()=>{if(!document.hidden&&alive)poll();},60000);
    const onVis=()=>{if(!document.hidden&&alive)poll();};
    document.addEventListener("visibilitychange",onVis);
    return()=>{alive=false;clearInterval(id);document.removeEventListener("visibilitychange",onVis);};
  },[doLiveFetch]);

  const[simError,setSimError]=useState(null);
  const[simSeed,setSimSeed]=useState("");
  const runSim=()=>{
    setRunning(true);setTo(null);setSimError(null);
    setTimeout(()=>{
      try{
        const result=simAll(sc,{bracketMode});
        setSimSeed(Math.random().toString(36).slice(2,8).toUpperCase());setTo(result);setSimN(p=>p+1);setRunning(false);
        setTab(favTeam?"path":"groups");
      }catch(err){
        setRunning(false);
        setSimError(err.message||"Simulation error — please refresh and try again.");
        console.error("SimAll error:",err);
      }
    },500);
  };

  const runMC=async()=>{
    if(mcRunning) return;
    mcCancelRef.current=false;
    const n=MC_COUNTS[mcMode]||1000;
    setMcRunning(true);setMcRes(null);setMcProg(0);setTab("odds");
    const r=await runMCAsync(
      sc,n,
      p=>{if(!mcCancelRef.current)setMcProg(p);},
      ()=>mcCancelRef.current,
      {bracketMode}
    );
    if(!mcCancelRef.current&&r) setMcRes(r);
    setMcRunning(false);
  };
  const cancelMC=()=>{mcCancelRef.current=true;setMcRunning(false);setMcProg(0);};

  const share=()=>{
    if(!to)return;
    const fin=to.fin,w=fin.w,l=fin.w===fin.t1?fin.t2:fin.t1;
    const origin=typeof window!=="undefined"?window.location.origin:"globalfootballsim.com";
    const lockedCt=Object.values(RESULT_STATE.byMatchId||{}).filter(x=>x.locked).length;
    const modeLabel=simMode==="official"?"Live Official":simMode==="whatif"?"What-If":"Fun";
    const penStr=fin.pen?" (pens "+fin.pA+"–"+fin.pB+")":"";
    const txt="My 2026 tournament projection: "+w.name+" "+w.flag+" 🏆\n\n"
      +"Final: "+fin.t1.name+" "+fin.gA+"–"+fin.gB+" "+fin.t2.name+penStr
      +" · Runner-up: "+l.name+" "+l.flag+"\n"
      +"Based on "+lockedCt+"/104 real results locked · Mode: "+modeLabel+" · Scenario: "+sc.l+"\n"
      +"ID: GFS-2026-"+simSeed+" · "+new Date().toLocaleDateString()+"\n\n"
      +"Try yours 👉 "+origin+"\n#Football2026 #GlobalFootballSim #SoccerSimulator";
    // Use native share sheet on mobile, fallback to clipboard
    if(typeof navigator!=="undefined"&&navigator.share){
      navigator.share({title:"Global Football Simulator 2026",text:txt,url:origin}).catch(()=>navigator.clipboard?.writeText(txt));
    } else {
      navigator.clipboard?.writeText(txt);
    }
    setCopied(true);setTimeout(()=>setCopied(false),2500);
  };

  const toggleG=g=>setExpandedG(p=>({...p,[g]:!p[g]}));
  const openNar=m=>setNarMatch(m);
  // Three simulation modes
  const[simMode,setSimMode]=useState("official"); // "official" | "whatif" | "fun"
  const isFunMode=simMode==="fun";
  const isOfficialMode=simMode==="official"||simMode==="whatif";
  const bracketMode=isFunMode?"fun":"official"; // passed to simAll
  const KO_NOTE=isFunMode
    ?"🎲 Fun Mode: knockout pairings are randomised for entertainment — not the official bracket path."
    :"📋 Live Official Mode: completed real results locked. Future matches simulated. Official bracket path.";

  const TABS=[
    {id:"live",l:"🔴 Live"},
    {id:"groups",l:"📊 Groups"},{id:"r32",l:"🏟️ R32"},{id:"r16",l:"⚔️ R16"},
    {id:"qf",l:"🔥 QF"},{id:"sf",l:"⭐ SF"},{id:"final",l:"🏆 Final"},
    {id:"path",l:"⭐ My Team"},{id:"odds",l:"🎯 Stage Odds"},
    {id:"reactions",l:"🌍 Reactions"},{id:"squads",l:"👥 Squads"},
    ...(SHOW_ADMIN?[{id:"revenue",l:"💰 Revenue"}]:[]),
  ];

  return(
    <div style={{fontFamily:"'DM Sans',system-ui,sans-serif",background:T.bg,color:T.text,minHeight:"100vh"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@600;700&display=swap" rel="stylesheet"/>
      <SEOMeta/>
      <GlobalStyles/>
      <CookieBanner/>

      {/* ── HEADER ── */}
      <div style={{background:`linear-gradient(180deg,${T.card} 0%,${T.bg} 100%)`,borderBottom:`1px solid ${T.border}`,padding:"26px 20px 20px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 70% 50% at 50% -10%,rgba(34,211,238,0.06) 0%,transparent 70%)",pointerEvents:"none"}}/>
        <div style={{maxWidth:1100,margin:"0 auto",position:"relative"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <span style={{fontSize:8,padding:"3px 10px",borderRadius:20,background:`${T.gold}18`,color:T.gold,fontWeight:700,letterSpacing:1.5,border:`1px solid ${T.gold}33`}}>LIVE OFFICIAL MODE · INDEPENDENT FAN SIMULATION</span>
                <span style={{fontSize:9,color:T.muted}}>Completed real results locked · Not affiliated with FIFA, ESPN, or any official rights holder</span>
              </div>
              <h1 style={{fontSize:"clamp(22px,4vw,36px)",fontWeight:900,letterSpacing:-0.5,lineHeight:1.1,background:T.gradHdr,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:6}}>
                Global Football Simulator 2026
              </h1>
              <p style={{fontSize:12,color:T.muted}}>Independent fan simulator · 48 nations · custom scenarios · Monte Carlo champion odds</p>
              <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:6,alignItems:"center"}}>
                {[
                  {l:"Independent fan simulator",c:T.green},
                  {l:"Not affiliated with FIFA",c:T.muted},
                  {l:"Not a betting model",c:T.muted},
                  {l:"Entertainment only",c:T.muted},
                  {l:"Static squads · live overlay experimental",c:T.gold},
                ].map(({l,c})=>(
                  <span key={l} style={{fontSize:8,padding:"2px 8px",borderRadius:20,background:`${c}12`,color:c,border:`1px solid ${c}22`}}>{l}</span>
                ))}
              </div>
            </div>
            <div style={{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:9,color:T.muted}}>Data last reviewed</div>
                <div style={{fontSize:11,fontWeight:700,color:T.green}}>{DATA_VERIFIED}</div>
              </div>
              <div style={{width:1,height:32,background:T.border}}/>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:9,color:T.muted}}>Teams · Players</div>
                <div style={{fontSize:11,fontWeight:700,color:AUDIT.ok?T.green:T.gold,display:"flex",alignItems:"center",gap:4}}>
                  {AUDIT.ok?"✅":""} {AUDIT.teams}/48 · {AUDIT.tot}/1248
                </div>
              </div>
            </div>
          </div>
          {!AUDIT.ok&&<div style={{marginTop:8,padding:"6px 12px",background:`${T.orange}12`,border:`1px solid ${T.orange}44`,borderRadius:7,fontSize:9,color:T.orange}}>
            ⚠️ Data issues: {AUDIT.issues.slice(0,5).join(" · ")}{AUDIT.issues.length>5?` · +${AUDIT.issues.length-5} more`:""}
          </div>}
        </div>
      </div>

      <div style={{maxWidth:1100,margin:"0 auto",padding:"16px 16px 48px"}}>

        <Ad label="LEADERBOARD" size="728×90" style={{marginBottom:14}}/>

        {/* SCENARIO PICKER */}
        <div style={{marginBottom:12}}>
          <div style={{fontSize:9,color:T.muted,letterSpacing:1.5,fontWeight:700,marginBottom:8,textTransform:"uppercase"}}>Choose Scenario</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(148px,1fr))",gap:5}}>
            {SCENARIOS.map(s=>(
              <button key={s.id} className="sc-btn" onClick={()=>setSc(s)} style={{
                background:sc.id===s.id?`${T.green}14`:T.card,
                border:`1px solid ${sc.id===s.id?T.green:T.border}`,
                borderRadius:10,padding:"9px 11px",textAlign:"left",cursor:"pointer",transition:"all 0.15s",
                boxShadow:sc.id===s.id?`0 0 0 1px ${T.green}22,0 4px 16px ${T.green}10`:"none",
              }}>
                <div style={{fontSize:16,marginBottom:2}}>{s.icon}</div>
                <div style={{fontSize:12,fontWeight:700,color:sc.id===s.id?T.green:T.text}}>{s.l}</div>
                <div style={{fontSize:9,color:T.muted,marginTop:1}}>{s.d}</div>
              </button>
            ))}
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div style={{display:"flex",gap:6,marginBottom:8,flexWrap:"wrap"}}>
          <button onClick={runSim} disabled={running} style={{
            flex:"2 1 200px",padding:"13px 20px",background:running?"rgba(255,255,255,0.04)":T.gradBtnGreen,
            border:`1px solid ${running?T.border:T.green+"66"}`,borderRadius:12,color:running?T.muted:"#fff",
            fontSize:"clamp(13px,2.5vw,16px)",fontWeight:800,letterSpacing:0.5,cursor:running?"wait":"pointer",
            boxShadow:running?"none":`0 4px 28px rgba(16,185,129,0.25)`,transition:"all 0.2s",
          }}>{running?"⚽ Simulating…":simN===0?"🎲 Run Tournament Simulation":"🔄 Re-Simulate"}</button>

          <div style={{display:"flex",background:T.card,border:`1px solid ${T.border}`,borderRadius:8,padding:2,gap:1,flexShrink:0}}>
            {[["fast","⚡ 250"],["standard","🎯 1K"],["deep","🔬 5K"]].map(([m,l])=>(
              <button key={m} onClick={()=>setMcMode(m)} style={{padding:"4px 8px",borderRadius:6,border:"none",background:mcMode===m?T.gradBtnPurple:"transparent",color:mcMode===m?"#fff":T.muted,fontSize:9,fontWeight:mcMode===m?700:400,cursor:"pointer",whiteSpace:"nowrap"}}>
                {l}
              </button>
            ))}
          </div>
          <button onClick={mcRunning?cancelMC:runMC} disabled={running&&!mcRunning} style={{
            flex:"1 1 150px",padding:"13px 16px",
            background:mcRunning?`${T.red}20`:(running?"rgba(255,255,255,0.04)":T.gradBtnPurple),
            border:`1px solid ${mcRunning?T.red:running?T.border:T.purple+"66"}`,borderRadius:12,
            color:mcRunning?T.red:running?T.muted:"#fff",
            fontWeight:700,fontSize:12,cursor:running&&!mcRunning?"not-allowed":"pointer",
            boxShadow:mcRunning||running?"none":`0 4px 24px ${T.purple}30`,transition:"all 0.2s",
          }}>{mcRunning?`⏹ Cancel (${mcProg}%)`:mcRes?"📊 Stage Odds":"🎯 1,000× Odds"}</button>

          {to&&<button onClick={share} style={{
            flex:"1 1 110px",padding:"13px 14px",background:copied?`${T.green}12`:"rgba(255,255,255,0.03)",
            border:`1px solid ${copied?T.green:T.border}`,borderRadius:12,color:copied?T.green:T.muted,
            fontWeight:700,fontSize:12,cursor:"pointer",transition:"all 0.2s",
          }}>{copied?"✅ Copied!":"📤 Share"}</button>}
        </div>

        {/* SIMULATION MODE SELECTOR */}
        <div style={{display:"flex",gap:4,marginBottom:6,flexWrap:"wrap",alignItems:"center"}}>
          <div style={{display:"flex",background:T.card,border:`1px solid ${T.border}`,borderRadius:8,padding:3,gap:1}}>
            {[
              ["official","🔴 Live Official","Real results locked · official bracket"],
              ["whatif","🔀 What-If","Real results stay · your scenario affects future"],
              ["fun","🎲 Fun Mode","Fully randomised bracket · max drama"],
            ].map(([m,l,tip])=>(
              <button key={m} onClick={()=>setSimMode(m)}
                title={tip}
                style={{padding:"5px 11px",borderRadius:6,border:"none",cursor:"pointer",transition:"all 0.15s",whiteSpace:"nowrap",
                  background:simMode===m?(m==="fun"?T.gradBtnPurple:T.gradBtnGreen):"transparent",
                  color:simMode===m?"#fff":T.muted,fontWeight:simMode===m?700:400,fontSize:10}}>
                {l}
              </button>
            ))}
          </div>
        </div>
        <div style={{marginBottom:8}}>
          <select value={favTeam} onChange={e=>{setFavTeam(e.target.value);if(to)setTab("path");}}
            style={{width:"100%",background:T.card,border:`1px solid ${favTeam?T.gold:T.border}`,borderRadius:10,padding:"10px 14px",color:favTeam?T.text:T.muted,fontSize:12,cursor:"pointer",boxShadow:favTeam?`0 0 0 1px ${T.gold}22`:""  }}>
            <option value="">⭐ Choose your favourite team — see their tournament path</option>
            {Object.keys(SQUADS).sort().map(t=><option key={t} value={t}>{SQUADS[t].flag} {t}</option>)}
          </select>
        </div>

        {/* DATA STATUS BAR */}
        <DataStatusBar lastFetch={liveLastFetch} error={liveError} liveData={liveData}/>
        {/* LIVE SCORES TICKER */}
        <LiveBar liveData={liveData} lastFetch={liveLastFetch} loading={liveFetching} error={liveError}/>

        {simError&&<div style={{padding:"10px 14px",background:`${T.red}12`,border:`1px solid ${T.red}44`,borderRadius:8,marginBottom:8,fontSize:11,color:T.red,display:"flex",alignItems:"center",gap:8}}>
          <span>⚠️</span><span>{simError}</span>
          <button onClick={()=>setSimError(null)} style={{marginLeft:"auto",background:"none",border:"none",color:T.muted,cursor:"pointer"}}>✕</button>
        </div>}
        {simN>0&&<div style={{textAlign:"center",fontSize:10,color:T.muted,marginBottom:10,display:"flex",alignItems:"center",justifyContent:"center",gap:10,flexWrap:"wrap"}}>
          <span>Sim #{simN} · {sc.l} · ⚽ {to?.tg} goals</span>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:`${T.muted}88`}}>GFS-2026-{simSeed}</span>
          {Object.values(RESULT_STATE.byMatchId||{}).filter(m=>m.locked).length>0&&<span style={{color:T.green}}>🔒 {Object.values(RESULT_STATE.byMatchId||{}).filter(m=>m.locked).length}/104 locked</span>}
          <span style={{color:T.muted,fontSize:9}}>{simMode==="official"?"Official Bracket":simMode==="whatif"?"What-If":"Fun Mode"}</span>
        </div>}

        {/* CHAMPION BANNER */}
        {to&&<>
          <div style={{background:T.gradChamp,borderRadius:16,padding:"20px 24px",marginBottom:12,border:`1px solid ${T.gold}44`,animation:"champPulse 3s ease-in-out infinite, fadeUp 0.4s ease",textAlign:"center"}}>
            <div style={{fontSize:9,letterSpacing:3,color:`${T.gold}99`,fontWeight:700,marginBottom:8,textTransform:"uppercase"}}>{sc.l} Scenario — Simulated Champion</div>
            <div style={{fontSize:44,marginBottom:4}}>🏆</div>
            <div style={{fontSize:42,marginBottom:4}}>{to.fin.w.flag}</div>
            <div style={{fontSize:"clamp(22px,5vw,34px)",fontWeight:900,color:"#fef3c7",letterSpacing:-0.5}}>{to.fin.w.name}</div>
            <div style={{fontSize:11,color:`${T.gold}88`,marginTop:6}}>
              🥈 {(to.fin.w===to.fin.t1?to.fin.t2:to.fin.t1).name} · 🥉 {to.trd.w.name}
            </div>
          </div>

          <Ad label="MID-CONTENT 300×250" size="300×250" style={{marginBottom:10}}/>

          {/* TABS */}
          <div style={{overflowX:"auto",marginBottom:10}}>
            <div style={{display:"flex",gap:2,background:T.card,borderRadius:10,padding:3,border:`1px solid ${T.border}`,minWidth:"max-content"}}>
              {TABS.map(t=>(
                <button key={t.id} onClick={()=>setTab(t.id)} style={{
                  padding:"7px 13px",borderRadius:7,border:"none",whiteSpace:"nowrap",cursor:"pointer",
                  fontSize:11,fontWeight:tab===t.id?700:500,transition:"all 0.15s",
                  background:tab===t.id?T.gradBtnGreen:"transparent",color:tab===t.id?"#fff":T.muted,
                }}>{t.l}</button>
              ))}
            </div>
          </div>

          {/* GROUPS */}
          {tab==="live"&&<LiveScoresTab liveData={liveData} loading={liveFetching} error={liveError} lastFetch={liveLastFetch} onRefresh={doLiveFetch}/>}
          {tab==="groups"&&<>
            <div style={{marginBottom:8,padding:"8px 14px",background:`${T.blue}08`,border:`1px solid ${T.blue}22`,borderRadius:8,display:"flex",alignItems:"flex-start",gap:8,flexWrap:"wrap"}}>
              <span style={{flexShrink:0}}>📊</span>
              <div style={{flex:1}}>
                <strong style={{fontSize:10,color:T.text}}>Projected Final Standings</strong>
                <span style={{fontSize:9,color:T.muted}}> — 🔒 locked real results + 🎲 simulated future matches</span>
                <div style={{fontSize:8,color:`${T.muted}99`,marginTop:2}}>
                  Ties broken by: points → goal difference → goals scored → model fallback. Official standings may use additional criteria (fair play, disciplinary). Not current official FIFA standings.
                </div>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:8}}>
            {Object.entries(to.gr).map(([g,d],gi)=>(
              <div key={g}>
                <div style={{background:T.card,borderRadius:12,overflow:"hidden",border:`1px solid ${T.border}`}}>
                  <div style={{padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${T.border}`,cursor:"pointer",background:T.cardHi}} onClick={()=>toggleG(g)}>
                    <span style={{fontSize:12,fontWeight:800,letterSpacing:2,background:T.gradHdr,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>GROUP {g}</span>
                    <span style={{fontSize:11,color:T.muted}}>{expandedG[g]?"▴ Hide":"▾ Matches"}</span>
                    {d.standings.some(t=>d.matches.some(m=>(m.tA?.name===t.name||m.tB?.name===t.name)&&m.locked))&&
                      <span style={{fontSize:7,padding:"1px 5px",borderRadius:3,background:`${T.green}20`,color:T.green,fontWeight:700}}>🔒 Live</span>}
                  </div>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                    <thead><tr style={{borderBottom:`1px solid ${T.border}`}}>
                      {["","P","W","D","L","GD","Pts"].map(h=><th key={h} style={{textAlign:h===""?"left":"center",padding:"5px 3px 5px "+(h===""?"12px":"3px"),color:h==="Pts"?T.green:T.muted,fontWeight:600,fontSize:9,letterSpacing:0.5}}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {d.standings.map((t,i)=>(
                        <tr key={t.name} onClick={()=>setViewTeam(t.name)} style={{background:i<2?T.groupQ:i===2?T.groupT:"transparent",cursor:"pointer",borderBottom:`1px solid ${T.border}`,transition:"background 0.15s"}}
                          onMouseEnter={e=>e.currentTarget.style.background=i<2?"rgba(16,185,129,0.15)":i===2?"rgba(245,158,11,0.12)":"rgba(255,255,255,0.04)"}
                          onMouseLeave={e=>e.currentTarget.style.background=i<2?T.groupQ:i===2?T.groupT:"transparent"}>
                          <td style={{padding:"6px 3px 6px 12px"}}>
                            <div style={{display:"flex",alignItems:"center",gap:5}}>
                              <span style={{width:16,height:16,borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:800,background:i<2?T.green:i===2?T.gold:"#334155",color:"#fff",flexShrink:0}}>{i+1}</span>
                              <span style={{fontSize:14}}>{t.flag}</span>
                              <span style={{fontSize:11,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:88}}>{t.name}</span>
                            </div>
                          </td>
                          <td style={{textAlign:"center",color:T.muted,fontSize:10}}>3</td>
                          <td style={{textAlign:"center"}}>{t.w}</td>
                          <td style={{textAlign:"center"}}>{t.d}</td>
                          <td style={{textAlign:"center"}}>{t.l}</td>
                          <td style={{textAlign:"center",color:t.gd>0?T.green:t.gd<0?T.red:T.muted,fontWeight:600}}>{t.gd>0?"+":""}{t.gd}</td>
                          <td style={{textAlign:"center",fontWeight:800,color:T.green,fontSize:12,paddingRight:8}}>{t.pts}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {expandedG[g]&&(
                    <div style={{padding:"8px 10px",borderTop:`1px solid ${T.border}`,background:T.cardHi}}>
                      {d.matches.map((m,i)=><MatchRow key={i} m={{...m,t1:m.tA,t2:m.tB}} onClick={openNar}/>)}
                    </div>
                  )}
                </div>
                {gi===3&&<Ad label="IN-FEED 300×250" size="300×250" style={{marginTop:8}}/>}
              </div>
            ))}
          </div>
          </>}
          {tab==="r32"&&<KOList ms={to.r32} title="Round of 32" note={KO_NOTE} onReport={openNar}/>}
          {tab==="r16"&&<KOList ms={to.r16} title="Round of 16" note={KO_NOTE} onReport={openNar}/>}
          {tab==="qf" &&<KOList ms={to.qf}  title="Quarter-Finals" onReport={openNar}/>}
          {tab==="sf" &&<>
            <KOList ms={to.sf}    title="Semi-Finals" note={KO_NOTE} onReport={openNar}/>
            <div style={{marginTop:10}}><KOList ms={[to.trd]} title="3rd Place Play-Off" onReport={openNar}/></div>
            <Ad label="POST-KNOCKOUT 728×90" size="728×90" style={{marginTop:10}}/>
          </>}

          {tab==="final"&&<div style={{textAlign:"center",padding:"clamp(16px,4vw,32px) 20px",background:T.gradChamp,borderRadius:16,border:`1px solid ${T.gold}44`,boxShadow:`0 0 60px ${T.gold}15`}}>
            <div style={{fontSize:9,letterSpacing:3,color:`${T.gold}88`,fontWeight:700,marginBottom:14,textTransform:"uppercase"}}>🏆 The Grand Final — Simulated</div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"clamp(12px,5vw,44px)",flexWrap:"wrap",marginBottom:18}}>
              <div><div style={{fontSize:"clamp(36px,9vw,58px)"}}>{to.fin.t1.flag}</div><div style={{fontSize:"clamp(12px,3vw,16px)",fontWeight:700,color:"#fef3c7",marginTop:4}}>{to.fin.t1.name}</div></div>
              <div>
                <div style={{fontSize:"clamp(32px,8vw,54px)",fontWeight:900,color:"#fef3c7",fontFamily:"'JetBrains Mono',monospace",letterSpacing:4}}>{to.fin.gA} – {to.fin.gB}</div>
                {to.fin.pen&&<div style={{fontSize:11,color:T.gold,marginTop:2}}>Penalties {to.fin.pA}–{to.fin.pB}</div>}
              </div>
              <div><div style={{fontSize:"clamp(36px,9vw,58px)"}}>{to.fin.t2.flag}</div><div style={{fontSize:"clamp(12px,3vw,16px)",fontWeight:700,color:"#fef3c7",marginTop:4}}>{to.fin.t2.name}</div></div>
            </div>
            <div style={{fontSize:"clamp(14px,3vw,22px)",fontWeight:900,color:"#fef3c7",marginBottom:16}}>🏆 {to.fin.w.name} {to.fin.w.flag} — Simulated Champions!</div>
            <div style={{display:"flex",justifyContent:"center",gap:8,flexWrap:"wrap"}}>
              <button onClick={()=>openNar(to.fin)} style={{background:T.gradBtnGreen,border:"none",borderRadius:10,padding:"9px 20px",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:12}}>🎙️ AI Match Report</button>
              <button onClick={share} style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:10,padding:"9px 20px",color:"#fef3c7",fontWeight:700,cursor:"pointer",fontSize:12}}>{copied?"✅ Copied!":"📤 Share"}</button>
            </div>
            <Ad label="FINAL PREMIUM SPONSOR 970×250" size="970×250" style={{marginTop:16}}/>
          </div>}

          {tab==="path"&&<TeamPathPanel teamName={favTeam} tournament={to} onReport={openNar} onTeam={setViewTeam}/>}
          {tab==="odds"&&<StageOddsPanel results={mcRes} running={mcRunning} prog={mcProg} onRun={runMC} onModeChange={setMcMode}/>}
          {tab==="reactions"&&<FanReactions to={to}/>}
          {tab==="squads"&&<SquadsPanel onTeam={setViewTeam}/>}
        </>}

        {/* PRE-SIM STATE */}
        {!to&&<div>
          <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
            {[["squads","👥 Browse All 48 Squads"]].map(([id,l])=>(
              <button key={id} onClick={()=>setTab(id)} style={{padding:"8px 14px",borderRadius:8,background:tab===id?T.gradBtnGreen:"transparent",border:`1px solid ${tab===id?T.green:T.border}`,color:tab===id?"#fff":T.muted,fontWeight:700,fontSize:12,cursor:"pointer"}}>
                {l}
              </button>
            ))}
          </div>
          {tab==="live"&&<LiveScoresTab liveData={liveData} loading={liveFetching} error={liveError} lastFetch={liveLastFetch} onRefresh={doLiveFetch}/>}
          {tab==="squads"&&<SquadsPanel onTeam={setViewTeam}/>}
          {tab!=="squads"&&tab!=="live"&&<div style={{textAlign:"center",padding:"52px 20px"}}>
            <div style={{fontSize:60,marginBottom:16}}>⚽</div>
            <p style={{fontSize:18,fontWeight:800,marginBottom:6,background:T.gradHdr,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Choose a scenario and run the simulation</p>
            <p style={{fontSize:12,color:T.muted,marginBottom:4}}>48 nations · 1,248 players · 72 group matches · 104 total matches</p>
            <p style={{fontSize:10,color:T.muted}}>Independent fan tool · Not affiliated with FIFA · Ratings are model estimates</p>
            <div style={{marginTop:10,padding:"8px 14px",background:`${T.gold}10`,border:`1px solid ${T.gold}33`,borderRadius:8,fontSize:9,color:T.gold,display:"inline-block"}}>
              ✅ Live Launch — Completed real results locked · Future matches simulated · Official bracket path · Independent fan tool
            </div>
          </div>}
        </div>}

        <Ad label="FOOTER 728×90" size="728×90" style={{marginTop:16}}/>

        {/* FOOTER */}
        <div style={{marginTop:24,paddingTop:20,borderTop:`1px solid ${T.border}`}}>
          <div style={{display:"flex",justifyContent:"center",gap:16,flexWrap:"wrap",marginBottom:12}}>
            {Object.entries(LEGAL).map(([k,p])=>(
              <button key={k} className="leg-btn" onClick={()=>setLegalPage(k)} style={{background:"none",border:"none",color:T.muted,fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",gap:4,padding:0,transition:"color 0.15s"}}>
                {p.icon} {p.title}
              </button>
            ))}
            <a href="mailto:data@globalfootballsim.com" className="leg-btn" style={{color:T.muted,fontSize:11,textDecoration:"none",display:"flex",alignItems:"center",gap:4,transition:"color 0.15s"}}>🔍 Report Squad Error</a>
          </div>
          <p style={{fontSize:8.5,color:`${T.muted}88`,lineHeight:1.8,textAlign:"center",maxWidth:700,margin:"0 auto"}}>
            <strong style={{color:T.muted}}>Disclaimer:</strong> Global Football Simulator 2026 is an independent fan-made entertainment tool, not affiliated with FIFA, any national football association, tournament organiser, or any official rights holder. Player and team names used for editorial purposes only. Team ratings are independent estimates — not FIFA rankings. Squad data based on FIFA published final lists (June 2, 2026); may lag official sources as injury replacements are permitted up to 24 hours before a team's first match. Live score overlay is experimental and may lag official sources. AI match reports require a backend endpoint. This is not a betting model. Knockout pairings are randomised (Fun Mode) or follow official bracket path (Official Mode) and do not constitute official predictions.
          </p>
          <p style={{fontSize:8,color:`${T.muted}55`,textAlign:"center",marginTop:8}}>
            {DATA_SOURCE} · © 2026 Global Football Simulator · Independent Fan Project
          </p>
        </div>
      </div>

      {/* ── STICKY MOBILE BAR (hidden on desktop via media query approach) ──
          Shows only on small screens — gives quick access to core actions */}
      <div className="mobile-only">
        <StickyBar onRun={runSim} running={running} onShare={share} hasSim={!!to}
          favTeam={favTeam} setFavTeam={setFavTeam} onOdds={runMC} mcRunning={mcRunning}/>
      </div>

      {/* ── MODALS ── */}
      {legalPage&&<LegalModal page={legalPage} onClose={()=>setLegalPage(null)}/>}
      {viewTeam&&<TeamModal teamName={viewTeam} onClose={()=>setViewTeam(null)} onPlayer={(pl,tName)=>{setViewTeam(null);setViewPlayer({player:pl,teamName:tName});}}/>}
      {viewPlayer&&<PlayerCard player={viewPlayer.player} teamName={viewPlayer.teamName} onClose={()=>setViewPlayer(null)}/>}
      {narMatch&&<AIReport match={narMatch} onClose={()=>setNarMatch(null)}/>}
      {/* MCModal removed - Stage Odds panel shows full table */}
    </div>
  );
}
