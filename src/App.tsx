import React, { useEffect, useRef } from "react";
import styled from "styled-components";

const COUNT = 5;
const MIN_LEG = 2;
const MAX_LEG = 4;
const BOARD_SIZE = 9;
const MIN_X = 1;
const MAX_X = BOARD_SIZE - 1;

const users = ["a", "b", "c", "d", "e"];
const answers = ["1", "2", "3", "4", "5"];

function App() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const getRandomNumber = (max: number, min: number) => Math.floor(Math.random() * (max - min)) + min;

	// 가로줄 랜덤
	const getLegs = () => {
		const legOfColumn = Array.from({ length: COUNT - 1 }, () => getRandomNumber(MAX_LEG, MIN_LEG));
		const legs: number[][] = [];
		let rows: Set<number> = new Set();
		let column = 0;
		while (column < COUNT - 1) {
			if (rows.size === legOfColumn[column]) {
				legs.push([...rows].sort());
				rows.clear();
				column++;
				continue;
			}

			const randomNumber = getRandomNumber(MIN_X, MAX_X);
			if (column === 0) {
				rows.add(randomNumber);
			} else {
				legs[column - 1].includes(randomNumber) === false && rows.add(randomNumber);
			}
		}
		legs.push([]);
		return legs;
	};

	useEffect(() => {
		if (!canvasRef.current) return;
		const ctx = canvasRef.current.getContext("2d");
		if (ctx === null) return;

		const width = canvasRef.current.width;
		const height = canvasRef.current.height;
		ctx.lineWidth = 3;
		ctx.strokeStyle = "#333";

		const startX = width / (COUNT * 2);
		const startY = 0;
		const stepSize = (width - startX * 2) / (COUNT - 1);

		// 세로줄
		for (let column = 0; column < COUNT; column++) {
			ctx.beginPath();
			ctx.moveTo(startX + column * stepSize, 0);
			ctx.lineTo(startX + column * stepSize, startY + COUNT * stepSize);
			ctx.stroke();
		}

		const legs = getLegs();

		// 가로줄
		for (let column = 0; column < legs.length; column++) {
			for (const row of legs[column]) {
				ctx.beginPath();
				ctx.moveTo(startX + column * stepSize, startY + row * (height / MAX_X));
				ctx.lineTo(startX + stepSize * (column + 1), startY + row * (height / MAX_X));
				ctx.stroke();
			}
		}

		// 뭐 당첨되는지 체크
		const wins: { [key: string]: string } = {};
		for (let column = 0; column < COUNT; column++) {
			const visited = Array.from(Array(BOARD_SIZE), () => Array(COUNT).fill(false));
			const queue: number[][] = [];
			visited[0][column] = true;
			queue.push([0, column]);
			while (queue.length > 0) {
				const [x, y] = queue.shift()!;
				if (x === BOARD_SIZE - 1) {
					wins[users[column]] = answers[y];
					break;
				}
				if (y > 0 && legs[y - 1].includes(x) && visited[x][y - 1] === false) {
					visited[x][y - 1] = true;
					queue.push([x, y - 1]);
					continue;
				} else if (legs[y].includes(x) && visited[x][y + 1] === false) {
					visited[x][y + 1] = true;
					queue.push([x, y + 1]);
					continue;
				}

				visited[x + 1][y] = true;
				queue.push([x + 1, y]);
			}
		}
	}, []);

	return (
		<StyledApp className="App">
			<Wrapper>
				<List>
					{users.map((item, index) => (
						<Item key={`user_${index}`}>{item}</Item>
					))}
				</List>
				<div>
					<StyledCanvas ref={canvasRef} width="1500px" height="500px"></StyledCanvas>
				</div>
				<List>
					{answers.map((item, index) => (
						<Item key={`answer_${index}`}>{item}</Item>
					))}
				</List>
			</Wrapper>
		</StyledApp>
	);
}

export default App;

const StyledApp = styled.div`
	width: 100%;
	height: 100%;
`;

const Wrapper = styled.div`
	width: 80%;
	height: 100%;
	margin: 0 auto;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
`;

const StyledCanvas = styled.canvas`
	width: 100%;
`;

const List = styled.ul`
	width: 100%;
	display: flex;
	justify-content: space-between;
	margin: 10px 0;
`;

const Item = styled.li`
	word-break: break-all;
	text-align: center;
	flex-basis: 30%;
`;
