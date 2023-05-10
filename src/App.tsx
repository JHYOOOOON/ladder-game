import styled, { ThemeProvider } from "styled-components";
import * as Theme from "./Theme";
import { Home } from "./Pages";

function App() {
	return (
		<ThemeProvider theme={Theme}>
			<StyledApp className="App">
				<Home />
			</StyledApp>
		</ThemeProvider>
	);
}

export default App;

const StyledApp = styled.div`
	width: 100%;
	height: 100%;
	padding: ${({ theme }) => theme.fontSize.xxl}rem ${({ theme }) => theme.fontSize.xxxl}rem;
	box-sizing: border-box;
`;
