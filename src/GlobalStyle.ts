import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

const GlobalStyle = createGlobalStyle`
    ${reset}

    html, body * {
        font-family: 'IBM Plex Sans KR', sans-serif;
    }

    html, body, #root{
        width: 100%;
        height: 100%;
    }
`;

export default GlobalStyle;
