import type React from "react";
import { createContext, useContext, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import type { GameDifficultyType, WordType } from "../../../shared/types/interfaces";
import GroupPicker from "./group-picker";
import GameTip from "./game-tip";
import type { GameType } from "@/entities/user";

interface InintialGameContextType {
    data: undefined | WordType[];
    group: string;
}

interface GameContextType {
    initial: InintialGameContextType;
    setInitial: React.Dispatch<React.SetStateAction<InintialGameContextType>>;
}

export const GameContext = createContext<GameContextType>({
    initial: { data: undefined, group: "0" },
    setInitial: () => {},
});

export function GameInitialData() {
    const location = useLocation();

    const [initial, setInitial] = useState<InintialGameContextType>({
        data: location?.state?.data,
        group: location?.state?.group || "0",
    });

    return (
        <GameContext.Provider value={useMemo(() => ({ initial, setInitial }), [initial, setInitial])}>
            <Outlet />
        </GameContext.Provider>
    );
}

function GameStartScreen({ value, type }: { value: GameDifficultyType; type: GameType }) {
    const { initial, setInitial } = useContext(GameContext);

    const navigate = useNavigate();

    return (
        <main className="main">
            <h2 className="main__title_main">{type}</h2>
            <GroupPicker
                value={value}
                onSubmit={formData => {
                    setInitial({
                        ...initial,
                        group: formData.group,
                    });

                    navigate("game");
                }}
            />
            <GameTip type={type} />
        </main>
    );
}

export default GameStartScreen;
