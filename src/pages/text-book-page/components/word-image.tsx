import type React from "react";
import { useEffect, useState } from "react";
import { fetchAndCreateReactImage } from "../../../shared/lib/utilities";
import Spinner from "../../../shared/ui/spinner/spinner";

function WordImage({ source }: { source: string }) {
    const [image, setImage] = useState<React.ReactElement | null>();

    useEffect(() => {
        fetchAndCreateReactImage(source).then(imageTemporary => {
            setImage(imageTemporary);
        });
    }, [source]);

    if (!image) {
        return <Spinner />;
    }

    return { image };
}

export default WordImage;
