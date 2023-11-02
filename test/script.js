"use strict";

const arr = [1, 2, 3, 4, 5];
const [x, y, z, t] = arr;
console.log(x, y, z, t);

const game = {
  team1: "Bayern Munich",
  team2: "Borrussia Dortmund",
  players: [
    [
      "Neuer",
      "Pavard",
      "Martinez",
      "Alaba",
      "Davies",
      "Kimmich",
      "Goretzka",
      "Coman",
      "Muller",
      "Gnarby",
      "Lewandowski",
    ],
    [
      "Burki",
      "Schulz",
      "Hummels",
      "Akanji",
      "Hakimi",
      "Weigl",
      "Witsel",
      "Hazard",
      "Brandt",
      "Sancho",
      "Gotze",
    ],
  ],
  score: "4:0",
  scored: ["Lewandowski", "Gnarby", "Lewandowski", "Hummels"],
  date: "Nov 9th, 2037",
  odds: {
    team1: 1.33,
    x: 3.25,
    team2: 6.5,
  },
};

const [players1, players2] = game.players;
console.log(players1);
console.log(players2);

const [gk, ...fieldPlayers] = players1;
console.log(gk, fieldPlayers);

const allPlayers = [...players1, ...players2];
console.log(allPlayers);

const playersFinal = [...players1, "Thiago", "Coutingo", "Perisic"];
console.log(playersFinal);

const {
  odds: { team1, x: draw, team2 },
} = game;
console.log(team1, draw, team2);

const printGoals = function (...goals) {
  for (let i = 0; i < goals.length; i++) console.log(goals[i]);
  console.log(`Total number of goals: ${goals.length}`);
};

printGoals(...game.scored);
team1 < team2 && console.log("Team1 is more likely to win");
team1 > team2 && console.log("Team2 is more likely to win");

//code challenge 2
for (const [idx, player] of game.scored.entries()) {
  console.log(`Goal ${idx + 1}: ${player}`);
}

let average = 0;
const odds = Object.values(game.odds);
for (const odd of odds) {
  average += odd;
}
average /= odds.length;
console.log(`Average odd: ${average}`);

for (const key of Object.keys(game.odds)) {
  console.log(`Odd of victory ${game[key] ?? "draw"}: ${game.odds[key]}`);
}

for (const [team, odd] of Object.entries(game.odds)) {
  const teamStr = game[team] === undefined ? "draw" : `victory ${game[team]}`;
  console.log(`Odd of victory ${teamStr}: ${odd}`);
}

const scorers = {};
for (const player of game.scored) {
  scorers[player] ? scorers[player]++ : (scorers[player] = 1);
}

const gameEvents = new Map([
  [17, "⚽️ GOAL"],
  [36, "🔁 Substitution"],
  [47, "⚽️ GOAL"],
  [61, "🔁 Substitution"],
  [64, "🔶 Yellow card"],
  [69, "🔴 Red card"],
  [70, "🔁 Substitution"],
  [72, "🔁 Substitution"],
  [76, "⚽️ GOAL"],
  [80, "⚽️ GOAL"],
  [92, "🔶 Yellow card"],
]);

//1
const uniqueEvents = [...new Set(gameEvents.values())];
console.log(uniqueEvents);

//2
gameEvents.delete(64);
console.log(gameEvents);

//3
const lastEventMin = [...gameEvents.keys()].pop();
console.log(
  `An event happened, an average, every ${
    lastEventMin / gameEvents.size
  } minutes`
);

//4
for (const [time, event] of gameEvents) {
  const gameHalf = time <= 45 ? "FIRST" : "SECOND";
  console.log(`[${gameHalf} HALF] ${time}: ${event}`);
}

const seat = "11B";
console.log(seat[seat.length - 1]);
console.log(seat.slice(-1));

//coding challenge 4
document.body.append(document.createElement("textarea"));
document.body.append(document.createElement("button"));
// THIS TEST DATA (pasted to textarea)
// underscore_case
//  first_name
// Some_Variable
//   calculate_AGE
// delayed_departure

// SHOULD PRODUCE THIS OUTPUT (5 separate console.log outputs)
// underscoreCase      ✅
// firstName           ✅✅
// someVariable        ✅✅✅
// calculateAge        ✅✅✅✅
// delayedDeparture    ✅✅✅✅✅

const btn = document.querySelector("button");
btn.addEventListener("click", function () {
  const textarea = document.querySelector("textarea");
  const textareaValues = textarea.value.split("\n");
  let maxLength = 0;

  const formattedWords = [];
  for (const value of textareaValues) {
    const [firstWord, lastWord] = value.trim().toLocaleLowerCase().split("_");
    const newWord =
      firstWord + lastWord.replace(lastWord[0], lastWord[0].toUpperCase());
    maxLength = maxLength < newWord.length ? newWord.length : maxLength;
    formattedWords.push(newWord);
  }

  const padLength = maxLength + 5;
  for (let i = 0; i < formattedWords.length; i++) {
    console.log(formattedWords[i].padEnd(padLength, " ") + "✅".repeat(i + 1));
  }
});

//practice

const flights =
  "_Delayed_Departure;fao93766109;txl2133758440;11:25+_Arrival;bru0943384722;fao93766109;11:45+_Delayed_Arrival;hel7439299980;fao93766109;12:05+_Departure;fao93766109;lis2323639855;12:30";

// 🔴 Delayed Departure from FAO to TXL (11h25)
//              Arrival from BRU to FAO (11h45)
//   🔴 Delayed Arrival from HEL to FAO (12h05)
//            Departure from FAO to LIS (12h30)
const getCode = (str) => str.slice(0, 3).toLocaleUpperCase();

const flightsArr = flights.split("+");
const formattedFlights = [];
let maxLength = 0;
for (const flight of flightsArr) {
  const flightData = flight.split(";");
  const delayed = flightData[0].includes("Delayed") ? "🔴" : "";
  const flightType = flightData[0].split("_").join(" ").trim();
  const from = getCode(flightData[1]);
  const to = getCode(flightData[2]);
  const flightTime = flightData[3].replace(":", "h");
  const flightStr = `${delayed} ${flightType} from ${from} to ${to} (${flightTime})`;
  maxLength = flightStr.length > maxLength ? flightStr.length : maxLength;
  formattedFlights.push(flightStr);
}

for (const flight of formattedFlights) {
  console.log(flight.padStart(maxLength + 3, " "));
}
