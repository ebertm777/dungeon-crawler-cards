"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Importa seus dados
const Party = [
  { Role: "Archer", STR: 7, DEX: 9, INT: 4 },
  { Role: "Warrior", STR: 11, DEX: 5, INT: 4 },
  { Role: "Knight", STR: 9, DEX: 4, INT: 7 },
  { Role: "Wizard", STR: 3, DEX: 2, INT: 15 },
  { Role: "Cleric", STR: 5, DEX: 1, INT: 14 },
  { Role: "Bard", STR: 4, DEX: 13, INT: 3 },
  { Role: "Thief", STR: 4, DEX: 12, INT: 4 },
  { Role: "Monk", STR: 10, DEX: 5, INT: 5 },
];
const fantasyNames = [
  "Cloud",
  "Sephiroth",
  "Tifa",
  "Aerith",
  "Zidane",
  "Garnet",
  "Vivi",
  "Freya",
  "Noctis",
  "Lunafreya",
  "Ardyn",
  "Ignis",
  "Gladiolus",
  "Prompto",
  "Celes",
  "Terra",
  "Locke",
  "Kefka",
  "Balthier",
  "Fran",
  "Ashe",
  "Basch",
  "Vayne",
  "Ramza",
  "Delita",
  "Ultimecia",
  "Edea",
  "Rinoa",
  "Squall",
  "Cid",
  "Drizzt",
  "Bruenor",
  "Wulfgar",
  "Jarlaxle",
  "Elminster",
  "Vecna",
  "Mordenkainen",
  "Tasha",
  "Acererak",
  "Strahd",
  "Vlaakith",
  "Karsus",
  "Fizban",
  "Tiamat",
  "Bahamut",
  "Raistlin",
  "Dalamar",
  "Tasselhoff",
  "Kitiara",
  "Eldrin",
  "Faelar",
  "Gwyndolin",
  "Isolde",
  "Thalindra",
  "Kaelith",
  "Seraphine",
  "Aelric",
  "Sylvaris",
  "Vaelith",
  "Zephyrion",
  "Aeris",
  "Nyx",
  "Veylan",
  "Caladrel",
  "Eowyn",
  "Maelis",
  "Rhydian",
  "Zarek",
  "Orin",
  "Lyanna",
  "Vaelin",
  "Ysolde",
  "Thalion",
  "Elarion",
  "Fenrir",
  "Altharion",
  "Celestia",
  "Solara",
  "Draven",
  "Kaelar",
  "Riven",
  "Velaris",
  "Sylphira",
  "Arannis",
  "Malrik",
  "Zaelith",
  "Thalor",
  "Vaedrin",
  "Ephyria",
  "Zypheros",
  "Orion",
  "Lorien",
  "Mirelle",
  "Veldrin",
  "Lirien",
  "Aurius",
  "Xanaphia",
  "Talanis",
  "Elowen",
  "Darian",
  "Galen",
  "Rowan",
  "Isilme",
  "Mystral",
  "Vespera",
  "Zephyria",
  "Tyrael",
  "Dusk",
  "Nimue",
];

const Reward = ["Oblivion 💀", "Glory 👼"];

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class Character {
  constructor(name, role) {
    this.name = name;
    this.role = role;
    this._reward = Reward[0];
  }

  assignReward(partyPower, bossDifficulty) {
    this._reward = partyPower >= bossDifficulty ? Reward[1] : Reward[0];
  }

  get reward() {
    return this._reward;
  }
}

class CharacterCreator extends Character {
  constructor(name, role, stats) {
    super(name, role);
    this.stats = stats;
  }
}

export default function BattleSimulator() {
  const [monsters, setMonsters] = useState([]);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch lista de monstros
  useEffect(() => {
    async function fetchMonsters() {
      const res = await fetch("https://www.dnd5eapi.co/api/monsters");
      const data = await res.json();

      // Embaralha a lista de monstros e pega 10 aleatórios
      const shuffled = data.results.sort(() => Math.random() - 0.5);
      const randomTen = shuffled.slice(0, 10);

      setMonsters(randomTen);
    }
    fetchMonsters();
  }, []);

  // Fetch dos detalhes ao selecionar
  async function selectMonster(index) {
    setLoading(true);
    const res = await fetch(`https://www.dnd5eapi.co${monsters[index].url}`);
    const data = await res.json();
    setSelected(data);
    setLoading(false);
  }

  // Função para iniciar o combate
  async function handleFight() {
    if (!selected) return;

    const getRandomStatsSum = ({ Role, ...stats }) => {
      const statKeys = Object.keys(stats);
      const [stat1, stat2] = statKeys
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);
      return stats[stat1] + stats[stat2];
    };

    const bossName = selected.name;
    const bossDifficulty = selected.challenge_rating * 8; // exemplo de cálculo do chalenge
    const dungeonName = "API Dungeon";

    const partyMembersRandomStats = Party.map(getRandomStatsSum);
    const partyPowerLevel = partyMembersRandomStats.reduce((a, b) => a + b, 0);
    const finalResult = partyPowerLevel >= bossDifficulty ? "won" : "lost";

    const namesPool = [...fantasyNames];
    const characters = Party.map((member, i) => {
      const randomIndex = Math.floor(Math.random() * namesPool.length);
      const name = namesPool.splice(randomIndex, 1)[0];
      const character = new CharacterCreator(
        name,
        member.Role,
        partyMembersRandomStats[i]
      );
      character.assignReward(partyPowerLevel, bossDifficulty);
      return character;
    });

    // Gerador da narração
    const narration = await Promise.all(
      characters.map(async (char) => {
        await delay(300); // simula tempo de narração mais ou menos isso
        return `🧝 ${char.role} ${char.name}: contribuiu com ${char.stats} | recompensa: ${char.reward}`;
      })
    );

    // Narração final, vou melhorar isso aqui
    const finalNarration = `
        The party fought a formidable foe, ${bossName}, in the dungeon ${dungeonName}.
        Eventually, they ${finalResult}, and were sent to ${
      Reward[finalResult === "won" ? 1 : 0]
    }!
        The party total power was ${partyPowerLevel} and the boss Difficulty was ${bossDifficulty}.
      `;

    // Atualiza o estado e a narração final
    setResult({
      narration,
      bossName,
      dungeonName,
      bossDifficulty,
      partyPowerLevel,
      outcome: finalResult,
      bossType: selected.type,
      bossHP: selected.hit_points,
      finalNarration, // Adicionando a narração do resultado final
    });
  }

  return (
    <div className="bg-black text-white p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">⚔️ Simulador de Batalha RPG</h1>

      {/* Lista de monstros obtida da api */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {monsters.map((monster, index) => (
          <motion.div
            key={monster.index}
            className="bg-gray-800 text-white p-4 rounded-xl shadow-md text-center font-bold"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <button
              //   key={m.index}
              className="bg-gray-800 p-4 rounded hover:bg-gray-700 cursor-pointer"
              onClick={() => selectMonster(index)}
            >
              {monster.name}
            </button>
          </motion.div>
        ))}
      </div>

      {loading && <p className="mb-4">Carregando monstro...</p>}

      {selected && (
        <div className="mb-4 p-4 bg-gray-900 rounded">
          <h2 className="text-xl font-bold">{selected.name}</h2>
          <p>Tipo: {selected.type}</p>
          <p>Desafio: {selected.challenge_rating}</p>
          <p>HP: {selected.hit_points}</p>
          <button
            onClick={handleFight}
            className="mt-3 px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-500"
          >
            Lutar contra este monstro
          </button>
        </div>
      )}

      {result && (
        <div className="mt-6 bg-gray-800 p-4 rounded">
          <h3 className="text-xl font-bold mb-2">📜 Resultado:</h3>
          <p>Dungeon: {result.dungeonName}</p>
          <p>
            Boss: {result.bossName} ({result.bossType})
          </p>
          <p>
            HP: {result.bossHP} | Dificuldade: {result.bossDifficulty}
          </p>
          <p>Party Power: {result.partyPowerLevel}</p>
          <p>
            Resultado:{" "}
            {result.outcome === "won" ? "Vitória! 🎉" : "Derrota... ☠️"}
          </p>

          <ul className="mt-4 list-disc list-inside space-y-1">
            {result.narration.map((line, idx) => (
              <li key={idx}>{line}</li>
            ))}
          </ul>

          <p className="mt-4 font-semibold">{result.finalNarration}</p>
        </div>
      )}
    </div>
  );
}
