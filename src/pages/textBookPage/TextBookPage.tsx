import React, { useContext, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import PagePicker from "./components/PagePicker";
import GroupSelect from "./components/GroupSelect";
import { useGetAllWordsQuery } from "../../store/wordsApi";
import WordList from "./components/WordList";
import ModalContext from "../../components/modal/ModalContext";
import GamesPanel from "./components/GamesPanel";
import { StyledMain } from "../../styled/SharedStyles";
import Spinner from "../../components/spinner/Spinner";
import { useAppSelector } from "../../store/store";
import { useGetUserWordsQuery } from "../../store/userWordsApi";
import { ScreenSize, WordType } from "../../interfaces";

export const StyledTextBookContainer = styled("div")`
    overflow: auto;
    max-height: 55svh;
    position: relative;
    flex-grow: 2;
    mask-image: linear-gradient(rgba(0, 0, 0, 1) 90%, rgba(0, 0, 0, 0.2));
    mask-size: 100% 100%;
    mask-repeat: no-repeat;
    display: flex;
    align-items: safe center;
    justify-content: center;

    @media ${ScreenSize.TABLET} {
        max-height: 60svh;
    }

    @media ${ScreenSize.LAPTOPS} {
        mask-image: unset;
        max-height: unset;
    }
`;

const StyledTextBookSettings = styled("div")`
    display: flex;
    gap: 1rem;
    padding: 1rem;
    flex-direction: column;
    align-items: center;
`;

function TextBookPage() {
    const [page, setPage] = useState(0);
    const [group, setGroup] = useState("0");

    const [learnedWords, setLearnedWords] = useState<WordType[]>([]);

    const { data, isLoading: isLoadingAllWords } = useGetAllWordsQuery(
        { group, page },
        {
            refetchOnMountOrArgChange: true,
        },
    );

    const { user } = useAppSelector(state => state.persist.auth);

    const {
        data: userWords,
        isSuccess,
        isLoading: isLoadingUserWords,
    } = useGetUserWordsQuery(
        {
            userId: user?.localId || "localId",
            tokenId: user?.idToken || "idToken",
        },
        {
            skip: !user,
        },
    );

    useEffect(() => {
        if (isSuccess && userWords && data) {
            setLearnedWords(data.filter(word => userWords[word.id]?.learned));
        }
    }, [userWords, isSuccess, data]);

    const pageMemo = useMemo(() => ({ page, setPage }), [page]);
    const groupMemo = useMemo(() => ({ group, setGroup }), [group]);

    const { setContent } = useContext(ModalContext);

    if (isLoadingAllWords || isLoadingUserWords) return <Spinner />;

    if (data) {
        return (
            <StyledMain>
                <h2 className="main__title_main">Textbook</h2>

                <StyledTextBookContainer>
                    <WordList data={data} learned={learnedWords} />
                </StyledTextBookContainer>

                <StyledTextBookSettings>
                    <PagePicker values={pageMemo} />
                    <GroupSelect values={groupMemo} />
                    <button
                        type="button"
                        onClick={() => {
                            setContent(<GamesPanel data={data} group={groupMemo.group as unknown as string} />);
                        }}>
                        Practice this set of words
                    </button>
                </StyledTextBookSettings>
            </StyledMain>
        );
    }

    return <div>No data found</div>;
}

export default TextBookPage;
