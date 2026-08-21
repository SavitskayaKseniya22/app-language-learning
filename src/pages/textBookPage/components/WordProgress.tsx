import React from "react";
import Streak from "../../game/components/Streak";
import { WordWithIdDataType } from "../../../interfaces";

function WordProgress({ wordDataDetailed }: { wordDataDetailed: WordWithIdDataType | null }) {
    return <Streak streak={wordDataDetailed?.guessed || 0} total={wordDataDetailed?.difficult ? 5 : 3} />;
}

export default WordProgress;
