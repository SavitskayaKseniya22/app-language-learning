import { ErrorType } from "@/shared/types/interfaces";
import styled from "styled-components";

const StyledErrorPage = styled("div")`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-grow: 2;
`;

function ErrorPage({ type }: { type: ErrorType }) {
    return (
        <main className="main">
            <h2 className="main__title_main">{type === ErrorType.ERROR ? "Something went wrong" : "Nothing found"}</h2>
            <StyledErrorPage>
                <h3>Please reload the page or return to the Main Page.</h3>
            </StyledErrorPage>
        </main>
    );
}

export default ErrorPage;
