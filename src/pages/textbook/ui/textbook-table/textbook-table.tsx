import type { Word } from "@/entities/user";
import { getWordAssetUrl } from "@/entities/user";
import { AudioButton } from "@/shared/ui/audio-button";
import { ImagePreview } from "@/shared/ui/image-preview";
import { CustomTable } from "@/shared/ui/table";
import styles from "./textbook.module.scss";

export default function TextBookTable({
    tableId,
    words,
    new_words,
    learned_words,
}: {
    tableId: string;
    words: Word[];
    new_words?: Word[];
    learned_words?: Word[];
}) {
    return (
        <CustomTable
            tableId={tableId}

            data={{
                rows: words.map(item => {
                    const learnedIds = learned_words?.map(word => word.id);
                    const newIds = new_words?.map(word => word.id);

                    return {
                        content: {
                            preview_audio: <AudioButton path={item.audio} />,
                            preview: (
                                <ImagePreview src={getWordAssetUrl(item.image)} alt={item.text_meaning} size="medium" />
                            ),
                            word: (
                                <div className={styles.textbook__word}>
                                    <p className={styles.textbook__spelling}>{item.word}</p>
                                    <p className={styles.textbook__transcription}>{item.transcription}</p>
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

                            ...(learned_words && {
                                learned_words: (
                                    <div>
                                        {learnedIds?.includes(item.id) ? <i className="fa-solid fa-check"></i> : ""}
                                    </div>
                                ),
                            }),

                            ...(new_words && {
                                new_words: (
                                    <div>{newIds?.includes(item.id) ? <i className="fa-solid fa-check"></i> : ""}</div>
                                ),
                            }),
                        },
                    };
                }),
                titles: [
                    {
                        title: "",
                        key: "preview_audio",
                        widthInGrid: "64px",
                    },
                    {
                        title: "",
                        key: "preview",
                        widthInGrid: "64px",
                    },
                    {
                        title: "Слово",
                        key: "word",
                        mobileLayout: "stacked",
                        widthInGrid: "minmax(180px, 0.75fr)",
                    },
                    {
                        title: "Значение",
                        key: "meaning",
                        mobileLayout: "stacked",
                        widthInGrid: "minmax(240px, 2fr)",
                    },
                    {
                        title: "Пример",
                        key: "example",
                        mobileLayout: "stacked",
                        widthInGrid: "minmax(240px, 2fr)",
                    },

                    ...(learned_words
                        ? [
                              {
                                  title: "Выучено сейчас",
                                  key: "learned_words",
                                  widthInGrid: "80px",
                              },
                          ]
                        : []),

                    ...(new_words
                        ? [
                              {
                                  title: "Новое слово",
                                  key: "new_words",
                                  widthInGrid: "80px",
                              },
                          ]
                        : []),
                ],
            }}
        />
    );
}
