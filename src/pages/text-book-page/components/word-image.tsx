import type React from "react";
import { useEffect, useState } from "react";
import { fetchAndCreateReactImage } from "../../../utilities";
import Spinner from "../../../components/spinner/spinner";

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
