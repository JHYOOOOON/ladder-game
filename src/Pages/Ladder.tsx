import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { MAX_USER_COUNT, MIN_USER_COUNT } from "../constants";

const MIN_LEG = 2;
const MAX_LEG = 5;
const BOARD_SIZE = 12;
const MIN_X = 1;
const MAX_X = BOARD_SIZE - 1;
const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

export const Ladder = () => {
	const navigate = useNavigate();
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const { count } = useParams();
	const countNum = Number(count);
	const users = ALPHABET.split("").slice(0, countNum);
	const answers = ALPHABET.split("").slice(0, countNum);
	const [matches, setMatches] = useState<{ [key: string]: string }>({});
	const [showResult, setShowResult] = useState(false);

	const getRandomNumber = (max: number, min: number) => Math.floor(Math.random() * (max - min)) + min;

	const getLegs = () => {
		const legOfColumn = Array.from({ length: countNum - 1 }, () => getRandomNumber(MAX_LEG, MIN_LEG));
		const legs: number[][] = [];
		let rows: Set<number> = new Set();
		let column = 0;
		while (column < countNum - 1) {
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
		if (countNum < MIN_USER_COUNT || countNum > MAX_USER_COUNT) {
			navigate("/");
		}
		if (!canvasRef.current) return;
		const ctx = canvasRef.current.getContext("2d");
		if (ctx === null) return;

		const width = canvasRef.current.width;
		const height = canvasRef.current.height;
		ctx.lineWidth = 3;
		ctx.strokeStyle = "#333";

		const startX = width / (countNum * 2);
		const startY = 0;
		const stepSize = (width - startX * 2) / (countNum - 1);

		// 세로줄
		for (let column = 0; column < countNum; column++) {
			ctx.beginPath();
			ctx.moveTo(startX + column * stepSize, 0);
			ctx.lineTo(startX + column * stepSize, startY + countNum * stepSize);
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
		for (let column = 0; column < countNum; column++) {
			const visited = Array.from(Array(BOARD_SIZE), () => Array(countNum).fill(false));
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
		setMatches(wins);
	}, []);

	return (
		<Wrapper>
			<List>
				{users.map((item, index) => (
					<Item key={`user_${index}`}>{item}</Item>
				))}
			</List>
			<StyledCanvas ref={canvasRef} width="1500px" height="500px"></StyledCanvas>
			<List>
				{answers.map((item, index) => (
					<Item key={`answer_${index}`}>{item}</Item>
				))}
			</List>
			<ButtonWrapper>
				<button onClick={() => setShowResult((prev) => !prev)}>전체 결과 {showResult ? "숨기기" : "보기"}</button>
				<button onClick={() => window.location.reload()}>다시 하기</button>
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
};

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
	word-break: break-all;
	text-align: center;
	flex-basis: 30%;
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
