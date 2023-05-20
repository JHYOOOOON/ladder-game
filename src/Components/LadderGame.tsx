import { MouseEvent, useEffect, useRef, useState } from "react";
import { useAtomValue } from "jotai";
import styled, { css } from "styled-components";

import { withResultNames, withUserCount, withUserNames } from "../States";
import { PrimaryButton, SecondaryButton } from "./Common";
import { BOARD_SIZE, COLORS, MAX_LEG, MAX_X, MIN_LEG, MIN_X } from "../constants";

type Match = { name: string; value: string[] };

type Matches = Match[];

export function LadderGame() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const userCount = useAtomValue(withUserCount);
	const [matches, setMatches] = useState<Matches>([]);
	const [showResult, setShowResult] = useState(false);
	const userNames = useAtomValue(withUserNames);
	const resultNames = useAtomValue(withResultNames);
	const [ladders, setLadders] = useState<number[][] | null>(null);
	const [clickedColumn, setClickedColumn] = useState<number | null>(null);
	const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
	const [data, setData] = useState<ImageData | null>(null);

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
		ctxRef.current = canvasRef.current.getContext("2d");
		const ctx = ctxRef.current;
		if (ctx === null) return;

		const width = canvasRef.current.width;
		const height = canvasRef.current.height;
		ctx.lineWidth = 3;
		ctx.strokeStyle = "#333";

		const startX = width / (userCount * 2);
		const stepSize = (width - startX * 2) / (userCount - 1);

		// 세로줄
		for (let column = 0; column < userCount; column++) {
			ctx.beginPath();
			ctx.moveTo(startX + column * stepSize, 0);
			ctx.lineTo(startX + column * stepSize, height);
			ctx.stroke();
		}

		const legs = getLegs();
		setLadders(legs);

		// 가로줄
		for (let column = 0; column < legs.length; column++) {
			for (const row of legs[column]) {
				ctx.beginPath();
				ctx.moveTo(startX + column * stepSize, row * (height / MAX_X));
				ctx.lineTo(startX + stepSize * (column + 1), row * (height / MAX_X));
				ctx.stroke();
			}
		}

		// 당첨 결과
		const wins = new Map();
		for (let column = 0; column < userCount; column++) {
			const visited = Array.from(Array(BOARD_SIZE), () => Array(userCount).fill(false));
			const queue: number[][] = [];
			visited[0][column] = true;
			queue.push([0, column]);
			while (queue.length > 0) {
				const [x, y] = queue.shift()!;
				if (x === BOARD_SIZE - 1) {
					if (wins.has(resultNames[y])) {
						wins.set(resultNames[y], [...wins.get(resultNames[y]), userNames[column]]);
					} else {
						wins.set(resultNames[y], [userNames[column]]);
					}
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
		const match: Matches = Array.from(wins, ([name, value]) => ({ name, value }));
		match.sort((a, b) => {
			if (a.value.length === b.value.length) {
				return a.name < b.name ? -1 : 1;
			} else {
				return a.value.length - b.value.length;
			}
		});
		setMatches(match);
		const canvasData = ctx.getImageData(0, 0, width, height);
		setData(canvasData);
	}, []);

	useEffect(() => {
		if (!ladders || clickedColumn === null || !canvasRef.current) return;
		if (!canvasRef.current || !ctxRef.current) return;
		const ctx = ctxRef.current;

		data && ctx.putImageData(data, 0, 0);

		const width = canvasRef.current.width;
		const height = canvasRef.current.height;
		ctx.lineWidth = 5;
		ctx.strokeStyle = COLORS[clickedColumn];

		const startX = width / (userCount * 2);
		const stepSize = (width - startX * 2) / (userCount - 1);

		const visited = Array.from(Array(BOARD_SIZE), () => Array(userCount).fill(false));
		const queue: number[][] = [];
		visited[0][clickedColumn] = true;
		queue.push([0, clickedColumn]);
		while (queue.length > 0) {
			const [x, y] = queue.shift()!;
			if (x === BOARD_SIZE - 1) {
				break;
			}
			if (y > 0 && ladders[y - 1].includes(x) && visited[x][y - 1] === false) {
				visited[x][y - 1] = true;
				queue.push([x, y - 1]);

				ctx.beginPath();
				ctx.moveTo(startX + y * stepSize, x * (height / MAX_X));
				ctx.lineTo(startX + stepSize * (y - 1), x * (height / MAX_X));
				ctx.stroke();

				continue;
			} else if (ladders[y].includes(x) && visited[x][y + 1] === false) {
				visited[x][y + 1] = true;
				queue.push([x, y + 1]);

				ctx.beginPath();
				ctx.moveTo(startX + y * stepSize, x * (height / MAX_X));
				ctx.lineTo(startX + stepSize * (y + 1), x * (height / MAX_X));
				ctx.stroke();

				continue;
			}

			visited[x + 1][y] = true;
			queue.push([x + 1, y]);
			ctx.beginPath();
			ctx.moveTo(startX + y * stepSize, (height / MAX_X) * x);
			ctx.lineTo(startX + y * stepSize, (height / MAX_X) * (x + 1));
			ctx.stroke();
		}
	}, [ladders, clickedColumn]);

	const handleClick = (event: MouseEvent) => {
		const target = event.target as HTMLElement;
		if (target.dataset.index === undefined) return;
		setClickedColumn(Number(target.dataset.index));
	};

	return (
		<Wrapper>
			<List onClick={handleClick}>
				{userNames.map((name, index) => (
					<User key={`user_${index}`}>
						<UserButton data-index={index}>{name}</UserButton>
					</User>
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
				{matches.map((item, index) => (
					<section key={`${item}_${index}`}>
						<ResultTitle>{item.name}</ResultTitle>
						<ResultList>
							{item.value.map((value, index) => (
								<ResultItem key={`${value}_${index}`}>{value}</ResultItem>
							))}
						</ResultList>
					</section>
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

const Item = css`
	display: flex;
	justify-content: center;
	align-items: flex-end;
	word-break: break-word;
	line-height: 1.2;
	flex-basis: 30%;
	font-size: ${({ theme }) => theme.fontSize.sm}rem;
	text-align: center;
`;

const User = styled.li`
	${Item}
`;

const UserButton = styled.button`
	background-color: transparent;
	border: none;
	cursor: pointer;
`;

const Result = styled.li`
	${Item}
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
	flex-direction: column;
	gap: 15px;
	width: 100%;
	&.show {
		display: flex;
	}
`;

const ResultTitle = styled.p`
	font-size: ${({ theme }) => theme.fontSize.xl}rem;
	margin-bottom: 7px;
`;

const ResultList = styled.ul`
	display: flex;
	gap: 5px;
	flex-wrap: wrap;
`;

const ResultItem = styled.li`
	padding: 5px 8px;
	border: 1px solid black;
	border-radius: 3px;
	word-break: keep-all;
`;
