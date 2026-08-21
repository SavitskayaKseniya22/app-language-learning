import React, { useEffect, useState } from "react";
import { fetchAndCreateReactImage } from "../../../utils";
import Spinner from "../../../components/spinner/Spinner";

function WordImage({ source }: { source: string }) {
    const [image, setImage] = useState<React.ReactElement | null>();

    useEffect(() => {
        fetchAndCreateReactImage(source).then(imageTemp => {
            setImage(imageTemp);
        });
    }, [source]);

    if (!image) {
        return <Spinner />;
    }

    return { image };
}

export default WordImage;
