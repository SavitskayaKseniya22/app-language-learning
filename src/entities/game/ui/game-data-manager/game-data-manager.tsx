import type { Word } from "@/entities/user";
import { useGetAllWordsByDifficultyQuery } from "@/entities/user/api/user-api";
import { ErrorComponent } from "@/shared/ui/error-component";
import { Spinner } from "@/shared/ui/spinner";
import { useLocation, Outlet, type Location } from "react-router-dom";

export default function GameDataManager() {
    const { state } = useLocation() as Location<{ difficulty?: number; data?: Word[]; complexity?: number } | null>;

    const passedData = state?.data;
    const passedDifficulty = state?.difficulty || 0;
    const passedComplexity = state?.complexity || 0;

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
        return <Outlet context={{ data: passedData, difficulty: passedDifficulty, complexity: passedComplexity }} />;
    }

    if (currentData) {
        return (
            <Outlet context={{ data: currentData.words, difficulty: passedDifficulty, complexity: passedComplexity }} />
        );
    }
}
