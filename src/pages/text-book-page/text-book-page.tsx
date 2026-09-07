import { useContext, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import PagePicker from "./components/page-picker";
import GroupSelect from "./components/group-select";
import { useGetAllWordsQuery } from "../../store/words-api";
import WordList from "./components/word-list";
import ModalContext from "../../shared/ui/modal/modal-context";
import GamesPanel from "../../widgets/games-list/ui/games-list";
import Spinner from "../../shared/ui/spinner/spinner";
import { useAppSelector } from "../../app/store/store";
import { useGetUserWordsQuery } from "../../store/user-words-api";
import type { WordType } from "../../shared/types/interfaces";
import { ScreenSize } from "../../shared/types/interfaces";

const StyledTextBookContainer = styled("div")`
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
            <main className="main">
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
                            setContent(<GamesPanel data={data} group={groupMemo.group} />);
                        }}>
                        Practice this set of words
                    </button>
                </StyledTextBookSettings>
            </main>
        );
    }

    return <div>No data found</div>;
}

export default TextBookPage;
