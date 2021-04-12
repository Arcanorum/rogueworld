import React, { useState, useEffect } from "react";
import PubSub from "pubsub-js";
import "./DungeonKeys.scss";
import { DUNGEON_KEYS } from "../../../../shared/EventTypes";
import blueKeyIcon from "../../../../assets/images/gui/hud/dungeon_keys/blue-key.png";
import brownKeyIcon from "../../../../assets/images/gui/hud/dungeon_keys/brown-key.png";
import greenKeyIcon from "../../../../assets/images/gui/hud/dungeon_keys/green-key.png";
import redKeyIcon from "../../../../assets/images/gui/hud/dungeon_keys/red-key.png";
import yellowKeyIcon from "../../../../assets/images/gui/hud/dungeon_keys/yellow-key.png";
import dungeonz from "../../../../shared/Global";

const KeyColourIcons = {
    blue: blueKeyIcon,
    brown: brownKeyIcon,
    green: greenKeyIcon,
    red: redKeyIcon,
    yellow: yellowKeyIcon,
};

function DungeonKeys() {
    const [keys, setKeys] = useState([]);

    useEffect(() => {
        const subs = [
            PubSub.subscribe(DUNGEON_KEYS, (msg, data) => {
                const newKeys = [];
                let counter = 0;

                // Add an icon for each key.
                Object.entries(data).forEach(([colour, amount]) => {
                    for (let i = 0; i < amount; i += 1) {
                        counter += 1;
                        newKeys.push({
                            counter,
                            src: KeyColourIcons[colour],
                        });
                    }
                });

                // Count how many keys there are now.
                let newKeysCount = 0;
                Object.values(data).forEach((keyTypeCount) => {
                    newKeysCount += keyTypeCount;
                });

                // If a key has been gained, play the key pickup sound.
                if (newKeysCount > keys.length) {
                    dungeonz.gameScene.soundManager.effects.sounds.dungeonKeyGained.play();
                }

                setKeys(newKeys);
            }),
        ];

        return () => {
            subs.forEach((sub) => {
                PubSub.unsubscribe(sub);
            });
        };
    }, []);

    return (
        <>
            {keys.length && (
            <div className="dungeon-keys-cont">
                <div className="list">
                    {keys.map((key) => (
                        <img
                          key={key.counter}
                          src={key.src}
                          draggable={false}
                          className="icon"
                        />
                    ))}
                </div>
            </div>
            )}
        </>
    );
}

export default DungeonKeys;
