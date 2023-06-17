import { MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import { useAtomValue } from "jotai";
import styled, { css } from "styled-components";

import { withResultNames, withUserCount, withUserNames } from "../States";
import {
	BOARD_SIZE,
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	COLORS,
	LINE_COLOR,
	LINE_WIDTH,
	MAX_LEG,
	MAX_X,
	MIN_LEG,
	MIN_X,
} from "../constants";
import { getRandomNumber } from "../utils";
import { ResultSection } from ".";

type Match = { name: string; value: string[] };

export type Matches = Match[];

export function LadderGame() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const userCount = useAtomValue(withUserCount);
	const [matches, setMatches] = useState<Matches>([]);
	const userNames = useAtomValue(withUserNames);
	const resultNames = useAtomValue(withResultNames);
	const [ladders, setLadders] = useState<number[][] | null>(null);
	const [clickedColumn, setClickedColumn] = useState<number | null>(null);
	const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
	const [initLadderData, setInitLadderData] = useState<ImageData | null>(null);

	const getLegs = useCallback(() => {
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
	}, []);

	const drawLine = useCallback((ctx: CanvasRenderingContext2D, startXY: [number, number], endXY: [number, number]) => {
		ctx.beginPath();
		ctx.moveTo(startXY[0], startXY[1]);
		ctx.lineTo(endXY[0], endXY[1]);
		ctx.stroke();
	}, []);

	const drawVerticalLine = useCallback(
		(ctx: CanvasRenderingContext2D, columnCount: number, startX: number, stepSize: number) => {
			for (let column = 0; column < columnCount; column++) {
				drawLine(ctx, [startX + column * stepSize, 0], [startX + column * stepSize, CANVAS_HEIGHT]);
			}
		},
		[]
	);

	const drawHorizontalLine = useCallback(
		(ctx: CanvasRenderingContext2D, startX: number, stepSize: number, legs: number[][]) => {
			for (let column = 0; column < legs.length; column++) {
				for (const row of legs[column]) {
					drawLine(
						ctx,
						[startX + column * stepSize, row * (CANVAS_HEIGHT / MAX_X)],
						[startX + stepSize * (column + 1), row * (CANVAS_HEIGHT / MAX_X)]
					);
				}
			}
		},
		[]
	);

	const handleMatchResults = useCallback(
		(ladders: number[][]) => {
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
					if (y > 0 && ladders[y - 1].includes(x) && visited[x][y - 1] === false) {
						visited[x][y - 1] = true;
						queue.push([x, y - 1]);
						continue;
					} else if (ladders[y].includes(x) && visited[x][y + 1] === false) {
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
		},
		[resultNames, userCount, userNames]
	);

	const saveCanvasData = useCallback((ctx: CanvasRenderingContext2D) => {
		const canvasData = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		setInitLadderData(canvasData);
	}, []);

	const handleUserNameClick = useCallback((event: MouseEvent) => {
		const target = event.target as HTMLElement;
		if (target.dataset.index === undefined) return;
		setClickedColumn(Number(target.dataset.index));
	}, []);

	useEffect(() => {
		if (!canvasRef.current) return;
		ctxRef.current = canvasRef.current.getContext("2d");
		const ctx = ctxRef.current;
		if (ctx === null) return;

		const width = canvasRef.current.width;
		const startX = width / (userCount * 2);
		const stepSize = (width - startX * 2) / (userCount - 1);
		const legs = getLegs();
		ctx.lineWidth = LINE_WIDTH;
		ctx.strokeStyle = LINE_COLOR;

		setLadders(legs);
		drawVerticalLine(ctx, userCount, startX, stepSize);
		drawHorizontalLine(ctx, startX, stepSize, legs);
		handleMatchResults(legs);
		saveCanvasData(ctx);
	}, [userCount]);

	useEffect(() => {
		if (!ladders || clickedColumn === null || !canvasRef.current) return;
		if (!canvasRef.current || !ctxRef.current) return;
		const ctx = ctxRef.current;

		initLadderData && ctx.putImageData(initLadderData, 0, 0);

		ctx.lineWidth = 5;
		ctx.strokeStyle = COLORS[clickedColumn % COLORS.length];

		const width = canvasRef.current.width;
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
				drawLine(
					ctx,
					[startX + y * stepSize, x * (CANVAS_HEIGHT / MAX_X)],
					[startX + stepSize * (y - 1), x * (CANVAS_HEIGHT / MAX_X)]
				);
				continue;
			} else if (ladders[y].includes(x) && visited[x][y + 1] === false) {
				visited[x][y + 1] = true;
				queue.push([x, y + 1]);
				drawLine(
					ctx,
					[startX + y * stepSize, x * (CANVAS_HEIGHT / MAX_X)],
					[startX + stepSize * (y + 1), x * (CANVAS_HEIGHT / MAX_X)]
				);
				continue;
			}

			visited[x + 1][y] = true;
			queue.push([x + 1, y]);
			drawLine(
				ctx,
				[startX + y * stepSize, (CANVAS_HEIGHT / MAX_X) * x],
				[startX + y * stepSize, (CANVAS_HEIGHT / MAX_X) * (x + 1)]
			);
		}
	}, [ladders, clickedColumn, initLadderData, userCount]);

	return (
		<Wrapper width={userCount * 150}>
			<List onClick={handleUserNameClick}>
				{userNames.map((name, index) => (
					<User key={`user_${index}`}>
						<UserButton data-index={index}>{name}</UserButton>
					</User>
				))}
			</List>
			<StyledCanvas ref={canvasRef} width={`${userCount * 150 * 2}px`} height={`${CANVAS_HEIGHT}px`}></StyledCanvas>
			<List>
				{resultNames.map((result, index) => (
					<Result key={`answer_${index}`}>{result}</Result>
				))}
			</List>
			<ResultSection matches={matches} />
		</Wrapper>
	);
}

const Wrapper = styled.div<{ width: number }>`
	width: ${({ width }) => width}px;
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
