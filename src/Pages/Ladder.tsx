import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

const MIN_LEG = 2;
const MAX_LEG = 5;
const BOARD_SIZE = 12;
const MIN_X = 1;
const MAX_X = BOARD_SIZE - 1;
const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

export const Ladder = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const { count } = useParams();
	const countNum = Number(count);
	const users = ALPHABET.split("").slice(0, countNum);
	const answers = ALPHABET.split("").slice(0, countNum);

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

			console.log(
				column,
				"column:::::",
				rows,
				legOfColumn[column],
				randomNumber,
				"hasbefore: ",
				column !== 0 && legs[column - 1].includes(randomNumber)
			);
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
