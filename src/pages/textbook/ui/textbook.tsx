import { useGetWordsByDifficultyQuery } from "@/app/api/user-api";
import { supabase } from "@/shared/api/supabase/config";
import ImagePreview from "@/shared/ui/image-preview/image-preview";
import CustomTable from "@/shared/ui/table/table";
import { useState } from "react";

function getWordAssetUrl(path: string | null) {
    if (!path) return "";

    return supabase.storage.from("words").getPublicUrl(path).data.publicUrl;
}

export default function TextbookPage() {
    const [difficulty, setDifficulty] = useState(1);
    const [page, setPage] = useState(1);

    const { data, isLoading, isFetching, error } = useGetWordsByDifficultyQuery({
        difficulty,
        page,
        pageSize: 20,
    });

    return (
        <div>
            {data && (
                <CustomTable
                    tableId={`textbook`}
                    data={{
                        rows: data?.words.map(item => {
                            return {
                                content: {
                                    id: item.word,
                                    meaning: item.text_meaning,
                                    preview: (
                                        <ImagePreview
                                            src={getWordAssetUrl(item.image)}
                                            alt={item.text_meaning}
                                            size="medium"
                                        />
                                    ),
                                },
                            };
                        }),
                        titles: [
                            { title: "Id", key: "id", widthInGrid: "minmax(120px, 2fr)" },
                            {
                                title: "Meaning",
                                key: "meaning",
                                widthInGrid: "minmax(120px, 2fr)",
                            },
                            {
                                title: "Preview",
                                key: "preview",
                                widthInGrid: "minmax(120px, 2fr)",
                            },
                        ],
                    }}
                />
            )}
        </div>
    );
}
