import { useGetAllWordsByDifficultyQuery } from "@/entities/user/api/user-api";
import { ErrorComponent } from "@/shared/ui/error-component";
import { Spinner } from "@/shared/ui/spinner";
import { useLocation, Outlet, type Location } from "react-router-dom";
import type { GameContextType } from "../../types";
import { complexityData, difficultyData } from "../../model/difficulty";

export default function GameDataManager() {
    const { state } = useLocation() as Location<Partial<GameContextType> | null>;

    const passedData = state?.data;
    const passedDifficulty = state?.difficulty || difficultyData[0].value;
    const passedComplexity = state?.complexity || complexityData[0].value;
    const passedIsTimed = state?.isTimed;

    const { isFetching, error, currentData } = useGetAllWordsByDifficultyQuery(
        {
            difficulty: passedDifficulty,
        },
        { skip: !!passedData },
    );

    if (isFetching) {
        return <Spinner />;
    }
    if (error) {
        return <ErrorComponent />;
    }
    if (passedData) {
        return (
            <Outlet
                context={{
                    data: passedData,
                    difficulty: passedDifficulty,
                    complexity: passedComplexity,
                    isTimed: !!passedIsTimed,
                }}
            />
        );
    }

    if (currentData) {
        return (
            <Outlet
                context={{
                    data: currentData.words,
                    difficulty: passedDifficulty,
                    complexity: passedComplexity,
                    isTimed: !!passedIsTimed,
                }}
            />
        );
    }
}
