import React, { use, useState } from 'react'
import GameOverScreen from './components/GameOverScreen'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { motion } from 'framer-motion'

const getRandomStat = () => Math.floor(Math.random() * 51) + 50 //Random between 50-100
const countries = ['USA', 'Portugal', 'Brazil', 'Japan', 'Germany', 'Australia']; //Countries to chose
const StatBar = ({ label, emoji, value, color }) => {
  return (
    <div className="stat-wrapper">
      <div className="stat-label">
        <span>{emoji}</span> {label}
      </div>
      <div className="stat-bar-container">
        <div
          className="stat-bar-fill"
          style={{
            width: `${value}%`,
            backgroundColor: color || '#4caf50'
          }}
        >
          {value}%
        </div>
      </div>
    </div>
  );
};

function App() {
  //User info
  const [username, setUsername] = useState('');
  const [country, setCountry] = useState(countries[0] || '');
  const [gameStarted, setGameStarted] = useState(false);
  const [age, setAge] = useState(0);
  const [stats, setStats] = useState({
    health: getRandomStat(),
    happiness: getRandomStat(),
    smarts: getRandomStat(),
    looks: getRandomStat()
  });
  const [lifeLog, setLifeLog] = useState([]);

  const [gameOver, setGameOver] = useState(false);

  const [event, setEvent] = useState(null);
  const [eventResolved, setEventResolved] = useState(true);

  //Events list
  const lifeEvents = [
    {
      description: "You found a mysterious cookie on the ground.",
      options: ["Eat it", "Throw it away"],
      effects: [
        { health: -10, smarts: -5, happiness: +10 }, // Eat it
        { health: 0, smarts: +5, happiness: -2 }     // Throw it away
      ]
    },
    {
      description: "Your mom signed you up for baby yoga.",
      options: ["Cry about it", "Enjoy the stretch"],
      effects: [
        { health: -5, happiness: -5 },
        { health: +5, happiness: +5 }
      ]
    }
  ];

  //Validation on user input
  const handleStart = () => {
    if (username.trim() === '' || country.trim() === '') {
      alert('Please enter both name or country.');
      return;
    }

    setGameStarted(true);
    setAge(0);
  };

  //Replay as the same character
  const handleReplaySameCharacter = () => {
    setAge(0);
    setStats({ health: 100, smarts: getRandomStat(), happiness: getRandomStat() });
    setLifeLog([]);
    setEvent(null);
    setEventResolved(true); //So Age Up button shows immediatly
    setGameOver(false);
    setGameStarted(true);
  };

  //Start new life
  const handleRestartGame = () => {
    setUsername('');
    setCountry('');
    setAge(0);
    setStats({ health: 100, smarts: getRandomStat(), happiness: getRandomStat() });
    setLifeLog([]);
    setEvent(null);
    setEventResolved(true); //So Age Up button shows immediatly
    setGameOver(false);
    setGameStarted(false);
  };

  const getCauseOfDeath = () => {
    const { health, happiness, smarts } = stats;

    if (health <= 0) return 'died from poor health 💉';
    if (happiness <= 0) return 'died of heartbreak 💔';
    if (smarts <= 0) return 'did something... incredibly dumb 🤦';

    // If nothing hit zero, random silly causes
    const randomCausesOfDeath = [
      "laughed too hard at a meme 😂💀",
      "tried to pet a wild goose 🪿",
      "thought a cactus was a toilet brush 🌵🚽",
      "ate 37 packets of ketchup 🍅",
      "vanished under mysterious circumstances 🕵️‍♂️",
      "got stuck in a vending machine 🤖",
      "challenge: lost to gravity 🪂",
      "accidentally invented a black hole 🕳️",
      "was too smart for this world 🧠✨",
      "choked on a single grain of rice 🍚"
    ];
    return randomCausesOfDeath[Math.floor(Math.random() * randomCausesOfDeath.length)];
  };

  //Age up (advance)
  const handleAgeUp = () => {
    const nextAge = age + 1;
    setAge(nextAge);

    //if (!eventResolved) return;
    const newEvent = lifeEvents[Math.floor(Math.random() * lifeEvents.length)];
    setEvent(newEvent);
    setEventResolved(false);

    //Log age change
    setLifeLog(prev => [...prev, `"You aged up to ${nextAge} years old.`])
  };

  //Handle option selected
  const handleOption = (optionIndex) => {
    // Get effects for chosen option
    const chosenEffects = event.effects?.[optionIndex];

    // Apply stat effects
    if (chosenEffects) {
      setStats(prevStats => {
        const newStats = {
          health: Math.max(0, Math.min(100, prevStats.health + (chosenEffects.health || 0))),
          smarts: Math.max(0, Math.min(100, prevStats.smarts + (chosenEffects.smarts || 0))),
          happiness: Math.max(0, Math.min(100, prevStats.happiness + (chosenEffects.happiness || 0))),
        };

        // If any stat reaches 0, game over!
        if (newStats.health === 0 || newStats.happiness === 0 || newStats.smarts === 0) {
          setGameOver(true);
          setEventResolved(true);
        }

        return newStats;
      });
    }

    // Add to history
    setLifeLog(prev => [
      ...prev,
      `Age ${age}: ${event.description} → You chose "${event.options[optionIndex]}"`
    ]);

    setEventResolved(true);
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          fontFamily: 'Arial',
          overflow: 'hidden' // no global scroll ever
        }}
      >
        <div className="main-wrapper fade-in">
          {!gameStarted ? (
            // === MAIN MENU ===
            <div
              style={{
                minHeight: '100vh',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                padding: '1rem'
              }}
            >
              <h1>Bitlofe Clone</h1>
              <input
                type="text"
                placeholder="Enter your name"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />{' '}
              <br /> <br />
              <select value={country} onChange={e => setCountry(e.target.value)}>
                {countries.map((c, i) => (
                  <option key={i} value={c}>
                    {c}
                  </option>
                ))}
              </select>{' '}
              <br /> <br />
              <button onClick={handleStart} disabled={!username.trim()}>
                Start Life
              </button>
            </div>
          ) : gameOver ? (
            // === GAME OVER SCREEN ===
            <GameOverScreen className="game-over-screen fade-in"
              name={username}
              age={age}
              onReplay={handleReplaySameCharacter}
              onMainMenu={handleRestartGame}
            />
          ) : (
            // === GAME SCREEN ===
            <>
              {/* Top Bar */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid #555',
                  padding: '0.5rem 1rem',
                  flexShrink: 0
                }}
              >
                <h2 style={{ margin: 0 }}>{username}</h2>
                <h2 style={{ margin: 0 }}>Age {age}</h2>
              </div>

              {/* Middle content */}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: 0, // allows internal scroll
                  padding: '1rem',
                  overflowY: 'auto'
                }}
                className="fade-in"
              >
                <p>🌍 Country: {country}</p>

                {/* Life Log */}
                <div style={{ marginTop: '2rem', flexGrow: 1 }}>
                  <h3>📜 Life Log</h3>
                  <div style={{ overflowY: 'auto', maxHeight: '300px' }}>
                    <ul>
                      {lifeLog.map((log, optionIndex) => (
                        <li key={optionIndex}>{log}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Age Up button */}
              {(!event || eventResolved) && (
                <div className='age-up-button' style={{ textAlign: 'center', marginTop: '2rem' }}>
                  <button onClick={handleAgeUp}>Age Up</button>
                </div>
              )}

              {/* Life Event */}
              {event && !eventResolved && (
                <div style={{ marginTop: '1rem' }}>
                  <h3>🗞️ Life Event:</h3>
                  <p>{event.description}</p>
                  <div className='choice-buttons'
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                      marginTop: '1rem'
                    }}
                  >
                    {event.options.map((opt, index) => (
                      <button key={index} onClick={() => handleOption(index)}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom stats bar */}
              <div
                style={{
                  borderTop: '1px solid #555',
                  padding: '0.5rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  flexShrink: 0
                }}
              >
                <StatBar
                  label="Health"
                  emoji="❤️"
                  value={stats.health}
                  color="#e74c3c"
                />
                <StatBar
                  label="Smarts"
                  emoji="🧠"
                  value={stats.smarts}
                  color="#9b59b6"
                />
                <StatBar
                  label="Happiness"
                  emoji="😊"
                  value={stats.happiness}
                  color="#f1c40f"
                />
              </div>
            </>
          )}
        </div>
      </div >
    </>
  )
}

export default App
