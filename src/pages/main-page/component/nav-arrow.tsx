import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

const sections = ["#section-0", "#section-1", "#section-2"];

const StyledNavArrow = styled("a")`
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    font-size: 2rem;
    color: rgb(38, 70, 83);
`;

export function NavArrow() {
    const location = useLocation();

    const [istItBottom, setItIsBottom] = useState(false);

    const index = sections.includes(location.hash) ? sections.indexOf(location.hash) : 0;

    const reference = useRef(null);

    useEffect(() => {
        if (location.hash === "#section-2") {
            setItIsBottom(true);
        } else {
            setItIsBottom(false);
        }
    }, [location.hash]);

    useEffect(() => {
        const handleScroll = () => {
            const elementPosition =
                (reference.current as unknown as HTMLAnchorElement).getBoundingClientRect().top + window.scrollY;
            const lowestPosition = document.body.clientHeight - window.innerHeight;

            if (elementPosition > lowestPosition) {
                setItIsBottom(true);
            } else {
                setItIsBottom(false);
            }
        };
        handleScroll();
        document.addEventListener("scrollend", handleScroll);

        return () => {
            document.removeEventListener("scrollend", handleScroll);
        };
    }, []);

    return (
        <StyledNavArrow href={sections[istItBottom ? 0 : index + 1]} ref={reference}>
            {istItBottom ? <i className="fa-solid fa-arrow-up" /> : <i className="fa-solid fa-arrow-down" />}
        </StyledNavArrow>
    );
}

export default NavArrow;
