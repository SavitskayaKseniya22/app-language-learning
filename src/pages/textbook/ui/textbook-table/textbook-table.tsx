import type { Word } from "@/entities/user";
import { getWordAssetUrl } from "@/entities/user";
import { AudioButton } from "@/shared/ui/audio-button";
import { ImagePreview } from "@/shared/ui/image-preview";
import { CustomTable } from "@/shared/ui/table";
import styles from "./textbook.module.scss";

export default function TextBookTable({ tableId, words }: { tableId: string; words: Word[] }) {
    return (
        <CustomTable
            tableId={tableId}

            data={{
                rows: words.map(item => {
                    return {
                        content: {
                            preview_audio: <AudioButton path={item.audio} />,
                            preview: (
                                <ImagePreview src={getWordAssetUrl(item.image)} alt={item.text_meaning} size="medium" />
                            ),
                            word: (
                                <div className={styles["textbook__column--main"]}>
                                    <p className={styles["textbook__word--writing"]}>{item.word}</p>
                                    <p className={styles["textbook__word--transcription"]}>{item.transcription}</p>
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
    );
}
