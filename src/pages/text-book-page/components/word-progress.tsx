import Streak from "../../game/components/streak";
import type { WordWithIdDataType } from "../../../shared/types/interfaces";

function WordProgress({ wordDataDetailed }: { wordDataDetailed: WordWithIdDataType | null }) {
    return <Streak streak={wordDataDetailed?.guessed || 0} total={wordDataDetailed?.difficult ? 5 : 3} />;
}

export default WordProgress;
