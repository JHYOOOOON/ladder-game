import styled, { ThemeProvider } from "styled-components";
import * as Theme from "./Theme";
import { Home } from "./Pages";

// const COUNT = 5;
// const MIN_LEG = 2;
// const MAX_LEG = 4;
// const BOARD_SIZE = 9;
// const MIN_X = 1;
// const MAX_X = BOARD_SIZE - 1;

// const users = ["a", "b", "c", "d", "e"];
// const answers = ["1", "2", "3", "4", "5"];

function App() {
	// const canvasRef = useRef<HTMLCanvasElement>(null);

	// const getRandomNumber = (max: number, min: number) => Math.floor(Math.random() * (max - min)) + min;

	// // 가로줄 랜덤
	// const getLegs = () => {
	// 	const legOfColumn = Array.from({ length: COUNT - 1 }, () => getRandomNumber(MAX_LEG, MIN_LEG));
	// 	const legs: number[][] = [];
	// 	let rows: Set<number> = new Set();
	// 	let column = 0;
	// 	while (column < COUNT - 1) {
	// 		if (rows.size === legOfColumn[column]) {
	// 			legs.push([...rows].sort());
	// 			rows.clear();
	// 			column++;
	// 			continue;
	// 		}

	// 		const randomNumber = getRandomNumber(MIN_X, MAX_X);
	// 		if (column === 0) {
	// 			rows.add(randomNumber);
	// 		} else {
	// 			legs[column - 1].includes(randomNumber) === false && rows.add(randomNumber);
	// 		}
	// 	}
	// 	legs.push([]);
	// 	return legs;
	// };

	// useEffect(() => {
	// 	if (!canvasRef.current) return;
	// 	const ctx = canvasRef.current.getContext("2d");
	// 	if (ctx === null) return;

	// 	const width = canvasRef.current.width;
	// 	const height = canvasRef.current.height;
	// 	ctx.lineWidth = 3;
	// 	ctx.strokeStyle = "#333";

	// 	const startX = width / (COUNT * 2);
	// 	const startY = 0;
	// 	const stepSize = (width - startX * 2) / (COUNT - 1);

	// 	// 세로줄
	// 	for (let column = 0; column < COUNT; column++) {
	// 		ctx.beginPath();
	// 		ctx.moveTo(startX + column * stepSize, 0);
	// 		ctx.lineTo(startX + column * stepSize, startY + COUNT * stepSize);
	// 		ctx.stroke();
	// 	}

	// 	const legs = getLegs();

	// 	// 가로줄
	// 	for (let column = 0; column < legs.length; column++) {
	// 		for (const row of legs[column]) {
	// 			ctx.beginPath();
	// 			ctx.moveTo(startX + column * stepSize, startY + row * (height / MAX_X));
	// 			ctx.lineTo(startX + stepSize * (column + 1), startY + row * (height / MAX_X));
	// 			ctx.stroke();
	// 		}
	// 	}

	// 	// 뭐 당첨되는지 체크
	// 	const wins: { [key: string]: string } = {};
	// 	for (let column = 0; column < COUNT; column++) {
	// 		const visited = Array.from(Array(BOARD_SIZE), () => Array(COUNT).fill(false));
	// 		const queue: number[][] = [];
	// 		visited[0][column] = true;
	// 		queue.push([0, column]);
	// 		while (queue.length > 0) {
	// 			const [x, y] = queue.shift()!;
	// 			if (x === BOARD_SIZE - 1) {
	// 				wins[users[column]] = answers[y];
	// 				break;
	// 			}
	// 			if (y > 0 && legs[y - 1].includes(x) && visited[x][y - 1] === false) {
	// 				visited[x][y - 1] = true;
	// 				queue.push([x, y - 1]);
	// 				continue;
	// 			} else if (legs[y].includes(x) && visited[x][y + 1] === false) {
	// 				visited[x][y + 1] = true;
	// 				queue.push([x, y + 1]);
	// 				continue;
	// 			}

	// 			visited[x + 1][y] = true;
	// 			queue.push([x + 1, y]);
	// 		}
	// 	}
	// }, []);

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
