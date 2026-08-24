import Streak from "../../game/components/streak";
import type { WordWithIdDataType } from "../../../interfaces";

function WordProgress({ wordDataDetailed }: { wordDataDetailed: WordWithIdDataType | null }) {
    return <Streak streak={wordDataDetailed?.guessed || 0} total={wordDataDetailed?.difficult ? 5 : 3} />;
}

export default WordProgress;
