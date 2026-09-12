import type React from "react";
import { useEffect, useState } from "react";
import Spinner from "../../../shared/ui/spinner/spinner";

function fetchAndCreateReactImage(partOfUrl: string) {
    return fetch(`https://raw.githubusercontent.com/SavitskayaKseniya22/rslang-data/data/${partOfUrl}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return response.blob();
        })
        .then(response =>
            React.createElement("img", {
                src: URL.createObjectURL(response),
            }),
        );
}

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
