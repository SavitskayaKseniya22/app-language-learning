import styled from "styled-components";
import type { WordType, WordWithIdDataType } from "../../../shared/types/wrong-interfaces";

import CollectionControl from "./collection-control";

const StyledCollectionControlPanel = styled("form")`
    display: flex;
    justify-content: space-between;
    gap: 1rem;
`;

enum CollectionType {
    DIFFICULT = "difficult",
    LEARNED = "learned",
    SELECTED = "selected",
}

function CollectionControlPanel({
    wordData,

    wordDataDetailed,
}: {
    wordData: WordType;

    wordDataDetailed: WordWithIdDataType | null;
}) {
    return (
        <StyledCollectionControlPanel>
            <CollectionControl
                wordData={wordData}
                collectionType={CollectionType.SELECTED}
                wordDataDetailed={wordDataDetailed}
            />
            <CollectionControl
                wordData={wordData}
                collectionType={CollectionType.LEARNED}
                wordDataDetailed={wordDataDetailed}
            />
            <CollectionControl
                wordData={wordData}
                collectionType={CollectionType.DIFFICULT}
                wordDataDetailed={wordDataDetailed}
            />
        </StyledCollectionControlPanel>
    );
}

export default CollectionControlPanel;
