import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import { mediaQuery } from "./Theme";

const GlobalStyle = createGlobalStyle`
    ${reset}

    html, body * {
        font-family: 'IBM Plex Sans KR', sans-serif;
    }

    html, body, #root{
        width: 100%;
        height: 100%;
        font-size: 16px;
        ${mediaQuery.tablet} {
            font-size: 14px;
        }
    }
`;

export default GlobalStyle;
