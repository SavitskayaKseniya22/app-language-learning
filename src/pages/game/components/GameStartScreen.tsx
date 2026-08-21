import React, { createContext, useContext, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { GameDifficultyType, GameType, WordType } from "../../../interfaces";
import GroupPicker from "./GroupPicker";
import { StyledMain } from "../../../styled/SharedStyles";
import GameTip from "./GameTip";

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
        <StyledMain>
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
        </StyledMain>
    );
}

export default GameStartScreen;
