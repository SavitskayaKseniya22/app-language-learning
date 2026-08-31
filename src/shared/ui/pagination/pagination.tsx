import { Button } from "../button";
import styles from "./pagination.module.scss";

const emptyString = "...";

function reduceDots(array: (number | "...")[]) {
    return array.filter((element, index) => element !== emptyString || array[index - 1] !== emptyString);
}

export default function Pagination({
    totalItems = 1,
    currentPage = 1,
    onPageChange,
    isDisabled = false,
    totalPages = 1,
}: {
    totalItems?: number;
    currentPage?: number;
    onPageChange: (value: number) => void;
    isDisabled?: boolean;
    totalPages?: number;
}) {
    const pages: number[] = Array.from({ length: totalPages }, (_, index) => index + 1);

    const filteredPages = pages.map(page => {
        const isItOnMargin = page === 1 || page === pages.at(-1);
        const isItInMiddleThree = [currentPage - 1, currentPage, currentPage + 1].includes(page);

        return isItOnMargin || isItInMiddleThree ? page : emptyString;
    });

    const reducedPages = reduceDots(filteredPages);

    return (
        <div className={styles.pagination}>
            <Button
                type="button"
                onClick={() => onPageChange(1)}
                disabled={isDisabled || totalItems === 0 || currentPage === 1}
                view="transparent">
                <i className="fa-solid fa-angles-left"></i>
            </Button>
            <Button
                view={"transparent"}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={isDisabled || totalItems === 0 || currentPage === 1}
                size="small">
                <i className="fa-solid fa-chevron-left"></i>
            </Button>

            <div className={styles.pagination__content}>
                {reducedPages.map((page, index) => {
                    return page == emptyString ? (
                        <Button view={"transparent"} key={page + index} size="small" disabled>
                            {page}
                        </Button>
                    ) : (
                        <Button
                            view={page == currentPage ? "secondary" : "transparent"}
                            key={page}
                            onClick={() => onPageChange(page)}
                            disabled={isDisabled || totalItems === 0 || page == currentPage}
                            size="small">
                            {page}
                        </Button>
                    );
                })}
            </div>

            <Button
                view={"transparent"}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={isDisabled || totalItems === 0 || currentPage === totalPages}
                size="small">
                <i className="fa-solid fa-chevron-right"></i>
            </Button>
            <Button
                type="button"
                onClick={() => onPageChange(totalPages)}
                disabled={isDisabled || totalItems === 0 || currentPage == totalPages}
                view="transparent">
                <i className="fa-solid fa-angles-right"></i>
            </Button>
        </div>
    );
}
