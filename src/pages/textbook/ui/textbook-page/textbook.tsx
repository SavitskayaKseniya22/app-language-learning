import { useContext, useState } from "react";
import styles from "./textbook.module.scss";
import { ModalContext } from "@/shared/ui/modal";
import { Button } from "@/shared/ui/button";
import { GamesList } from "@/widgets/games-list";
import { Spinner } from "@/shared/ui/spinner";
import { ErrorComponent } from "@/shared/ui/error-component";
import { Pagination } from "@/shared/ui/pagination";
import { PlaceholderList } from "@/shared/ui/placeholder-list";
import type { OptionType } from "@/shared/ui/select";
import { CustomSelect } from "@/shared/ui/select";
import { useGetWordsByDifficultyQuery } from "@/entities/user";
import { difficultyData } from "@/entities/game/model/difficulty";
import TextBookTable from "../textbook-table/textbook-table";

export default function TextbookPage() {
    const [difficulty, setDifficulty] = useState<OptionType<number>>({
        value: difficultyData[0].value,
        label: difficultyData[0].title,
    });
    const [page, setPage] = useState(1);

    const { data, isLoading, isFetching, error } = useGetWordsByDifficultyQuery({
        difficulty: difficulty.value,
        page,
        pageSize: 20,
    });

    //to do add checkboxes for add to learned

    const { setContent } = useContext(ModalContext);

    return (
        <div className={styles.textbook}>
            <div className={styles.textbook__controls}>
                <CustomSelect
                    label={`Select the word difficulty level:`}
                    isLoading={isLoading}
                    isDisabled={isLoading}
                    isSearchable={false}
                    defaultValue={{ value: 1, label: difficultyData[0].title }}
                    options={difficultyData.map(item => ({ value: item.value, label: item.title }))}

                    onChange={selectedOption => {
                        if (selectedOption) {
                            setDifficulty(selectedOption);
                            setPage(1);
                        }
                    }}
                />
                <Button
                    type="button"
                    disabled={!data}
                    onClick={() => {
                        if (data) {
                            setContent({
                                body: <GamesList data={data.words} size="small" />,
                                title: "Choose a game",
                                subTitle: "Practice chosen set of words",
                                options: { size: "big" },
                            });
                        }
                    }}>
                    Practice this set of words
                </Button>
            </div>
            {data && !error && <TextBookTable tableId="textbook" words={data.words} />}
            {error && <ErrorComponent />}
            {isFetching && data && <Spinner />}
            {isLoading && <PlaceholderList length={10} height="72px" />}
            <Pagination
                totalItems={data ? data.total : undefined}
                currentPage={page}
                onPageChange={setPage}
                isDisabled={isFetching || !!error}
                totalPages={data?.totalPages}
            />
        </div>
    );
}
