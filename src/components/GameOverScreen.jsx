import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const deathCauses = [
    "slipped on a banana peel 🍌",
    "forgot how to breathe 😵",
    "got into a fight with a goose 🪿",
    "was too curious about a glowing red button 🔴",
    "challenged gravity to a duel... and lost 🪂",
    "tried to high-five a cactus 🌵",
    "yawned too hard 😮‍💨",
    "met a ninja in the dark 🥷",
    "thought they could outsmart a vending machine 🤖",
];

const GameOverScreen = ({ name, age, onReplay, onMainMenu }) => {
    const [causeOfDeath, setCauseOfDeath] = useState("");

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * deathCauses.length);
        setCauseOfDeath(deathCauses[randomIndex]);
    }, []);

    return (
        <div className="game-over-screen">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="tombstone-card"
            >
                <div className="tombstone-icon">🪦</div>
                <h2 className="tombstone-rip">R.I.P.</h2>
                <h1 className="tombstone-name">{name}</h1>
                <p className="tombstone-age">Died at age {age}</p>
                <p className="tombstone-cause">{causeOfDeath}</p>

                <div className="tombstone-buttons">
                    <button onClick={onReplay}>Replay as same character</button>
                    <button onClick={onMainMenu}>Back to Main Menu</button>
                </div>
            </motion.div>
        </div>
    );
};

export default GameOverScreen;
