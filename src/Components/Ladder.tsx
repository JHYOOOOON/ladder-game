import { useEffect, useRef, useState } from "react";
import { useAtomValue } from "jotai";
import styled from "styled-components";

import { withResultNames, withUserCount, withUserNames } from "../States";
import { PrimaryButton, SecondaryButton } from "./Common";

const MIN_LEG = 2;
const MAX_LEG = 5;
const BOARD_SIZE = 12;
const MIN_X = 1;
const MAX_X = BOARD_SIZE - 1;

export function Ladder() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const userCount = useAtomValue(withUserCount);
	const [matches, setMatches] = useState<{ [key: string]: string }>({});
	const [showResult, setShowResult] = useState(false);
	const userNames = useAtomValue(withUserNames);
	const resultNames = useAtomValue(withResultNames);

	const getRandomNumber = (max: number, min: number) => Math.floor(Math.random() * (max - min)) + min;

	const getLegs = () => {
		const legOfColumn = Array.from({ length: userCount - 1 }, () => getRandomNumber(MAX_LEG, MIN_LEG));
		const legs: number[][] = [];
		let rows: Set<number> = new Set();
		let column = 0;
		while (column < userCount - 1) {
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

		const startX = width / (userCount * 2);
		const startY = 0;
		const stepSize = (width - startX * 2) / (userCount - 1);

		// 세로줄
		for (let column = 0; column < userCount; column++) {
			ctx.beginPath();
			ctx.moveTo(startX + column * stepSize, 0);
			ctx.lineTo(startX + column * stepSize, startY + userCount * stepSize);
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

		// 당첨 결과
		const wins: { [key: string]: string } = {};
		for (let column = 0; column < userCount; column++) {
			const visited = Array.from(Array(BOARD_SIZE), () => Array(userCount).fill(false));
			const queue: number[][] = [];
			visited[0][column] = true;
			queue.push([0, column]);
			while (queue.length > 0) {
				const [x, y] = queue.shift()!;
				if (x === BOARD_SIZE - 1) {
					wins[userNames[column]] = resultNames[y];
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
		setMatches(wins);
	}, []);

	return (
		<Wrapper>
			<List>
				{userNames.map((name, index) => (
					<Item key={`user_${index}`}>{name}</Item>
				))}
			</List>
			<StyledCanvas ref={canvasRef} width="1500px" height="500px"></StyledCanvas>
			<List>
				{resultNames.map((result, index) => (
					<Result key={`answer_${index}`}>{result}</Result>
				))}
			</List>
			<ButtonWrapper>
				<SecondaryButton onClick={() => window.location.reload()}>다시 하기</SecondaryButton>
				<PrimaryButton onClick={() => setShowResult((prev) => !prev)}>
					전체 결과 {showResult ? "숨기기" : "보기"}
				</PrimaryButton>
			</ButtonWrapper>
			<ResultWrapper className={`${showResult ? "show" : ""}`}>
				{Object.entries(matches).map(([key, value]) => (
					<ResultItem key={key}>
						<p>{key}</p>👉<p>{value}</p>
					</ResultItem>
				))}
			</ResultWrapper>
		</Wrapper>
	);
}

const Wrapper = styled.div`
	width: 100%;
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
	justify-content: space-around;
	margin: 10px 0;
`;

const Item = styled.li`
	display: flex;
	justify-content: center;
	align-items: flex-end;
	word-break: break-all;
	flex-basis: 30%;
`;

const Result = styled(Item)`
	align-items: flex-start;
`;

const ButtonWrapper = styled.div`
	display: flex;
	gap: 5px;
	margin: 15px 0;
	button {
		cursor: pointer;
	}
`;

const ResultWrapper = styled.ul`
	display: none;
	gap: 10px;
	width: 100%;
	flex-wrap: wrap;
	&.show {
		display: flex;
	}
`;

const ResultItem = styled.li`
	display: flex;
	padding: 10px 15px;
	gap: 5px;
	border: 1px solid black;
	border-radius: 5%;
`;
