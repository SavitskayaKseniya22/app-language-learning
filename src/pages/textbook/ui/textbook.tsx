import { useGetWordsByDifficultyQuery } from "@/app/api/user-api";
import ImagePreview from "@/shared/ui/image-preview/image-preview";
import CustomTable from "@/shared/ui/table/table";
import { useContext, useState } from "react";
import styles from "./textbook.module.scss";
import { AudioWithButton } from "@/shared/ui/audio-track-button";
import { getWordAssetUrl } from "@/shared/lib/utilities";
import { CustomSelect } from "@/shared/ui/select/select-from-library";
import Pagination from "@/shared/ui/pagination/pagination";
import ModalContext from "@/components/modal/modal-context";
import { Button } from "@/shared/ui/button";
import { GamesList } from "@/widgets/games-list";
import Spinner from "@/components/spinner/spinner";
import { PlaceholderList } from "@/shared/ui/placeholder-list/placeholder-list";
import ErrorComponent from "@/shared/ui/error-component/error-component";

export default function TextbookPage() {
    const [difficulty, setDifficulty] = useState(1);
    const [page, setPage] = useState(1);

    const { data, isLoading, isFetching, error } = useGetWordsByDifficultyQuery({
        difficulty,
        page,
        pageSize: 20,
    });
    //to do add checkboxes for add to learned

    const { setContent } = useContext(ModalContext);

    return (
        <div className={styles.textbook}>
            <div className={styles.textbook__controls}>
                <CustomSelect
                    label={`Select difficulty:`}
                    isLoading={isLoading}
                    isDisabled={isLoading}
                    isSearchable={false}
                    defaultValue={{ value: difficulty, label: difficulty.toString() }}
                    options={[
                        { value: 1, label: "1" },
                        { value: 2, label: "2" },
                        { value: 3, label: "3" },
                        { value: 4, label: "4" },
                        { value: 5, label: "5" },
                        { value: 6, label: "6" },
                    ]}
                    onChange={selectedOption => {
                        if (selectedOption) {
                            setDifficulty(selectedOption.value);
                            setPage(1);
                        }
                    }}
                />
                <Button
                    type="button"
                    disabled={!data}
                    onClick={() => {
                        if (data) {
                            setContent(<GamesList data={data.words} />);
                        }
                    }}>
                    Practice this set of words
                </Button>
            </div>
            {data && !error && (
                <CustomTable
                    tableId={`textbook`}
                    withTitles={false}
                    data={{
                        rows: data.words.map(item => {
                            return {
                                content: {
                                    preview_audio: <AudioWithButton path={item.audio} />,
                                    preview: (
                                        <ImagePreview
                                            src={getWordAssetUrl(item.image)}
                                            alt={item.text_meaning}
                                            size="medium"
                                        />
                                    ),
                                    word: (
                                        <div>
                                            <p>{item.word}</p>
                                            <p>{item.word_translate}</p>
                                        </div>
                                    ),
                                    meaning: (
                                        <div>
                                            <p>{item.text_meaning}</p>
                                            <p>{item.text_meaning_translate}</p>
                                        </div>
                                    ),
                                    example: (
                                        <div>
                                            <p>{item.text_example}</p>
                                            <p>{item.text_example_translate}</p>
                                        </div>
                                    ),
                                },
                            };
                        }),
                        titles: [
                            {
                                title: "Audio Preview",
                                key: "preview_audio",
                                widthInGrid: "64px",
                            },
                            {
                                title: "Preview",
                                key: "preview",
                                widthInGrid: "64px",
                            },
                            { title: "Word", key: "word", widthInGrid: "minmax(180px, 0.75fr)" },
                            {
                                title: "Meaning",
                                key: "meaning",
                                widthInGrid: "minmax(360px, 2fr)",
                            },
                            {
                                title: "Example",
                                key: "example",
                                widthInGrid: "minmax(360px, 2fr)",
                            },
                        ],
                    }}
                />
            )}
            {error && <ErrorComponent />}
            {isFetching && data && <Spinner />}
            {isLoading && <PlaceholderList length={10} height="72px" />}
            <Pagination
                totalItems={data ? 3600 : undefined}
                currentPage={page}
                onPageChange={setPage}
                isDisabled={isFetching || !!error}
                totalPages={data?.totalPages}
            />
        </div>
    );
}
