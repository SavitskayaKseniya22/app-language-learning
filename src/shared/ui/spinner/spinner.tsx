import styled from "styled-components";

const StyledSpinner = styled("div")`
    border: 5px dotted red;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: move 5s infinite linear;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    @keyframes move {
        0% {
            transform: rotate(0) scale(1.5);
        }
        50% {
            transform: rotate(180deg);
            border-radius: 50%;
        }
        100% {
            transform: rotate(360deg) scale(1.5);
        }
    }
`;

function Spinner() {
    return <StyledSpinner />;
}

export default Spinner;
