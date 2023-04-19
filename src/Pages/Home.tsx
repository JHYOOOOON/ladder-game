import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { HiOutlineMinus, HiOutlinePlus } from "react-icons/hi";

const MIN_USER_COUNT = 2;
const MAX_USER_COUNT = 10;
type VIEW_TYPE = "modify" | "view";

export const Home = () => {
	const [viewType, setViewType] = useState<VIEW_TYPE>("view");
	const [userCount, setUserCount] = useState(MIN_USER_COUNT);

	const addCount = () => setUserCount((prevValue) => prevValue + 1);
	const minusCount = () => setUserCount((prevValue) => prevValue - 1);

	useEffect(() => {
		const handleClick = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			if (target.classList.contains("count") === false) {
				if (userCount > MAX_USER_COUNT) {
					setUserCount(MAX_USER_COUNT);
				} else if (userCount < MIN_USER_COUNT) {
					setUserCount(MIN_USER_COUNT);
				}
				setViewType("view");
			}
		};

		document.addEventListener("click", handleClick);

		return () => document.removeEventListener("click", handleClick);
	}, [userCount]);

	return (
		<Wrapper>
			<InnerWrapper>
				<CountButton onClick={minusCount} disabled={userCount === MIN_USER_COUNT}>
					<HiOutlineMinus />
				</CountButton>
				{viewType === "view" ? (
					<Count className="count" onClick={() => setViewType("modify")}>
						{userCount}
					</Count>
				) : (
					<Input
						type="number"
						className="count"
						min={MIN_USER_COUNT}
						max={MAX_USER_COUNT}
						value={userCount}
						onChange={(e) => {
							setUserCount(Number(e.target.value));
						}}
					></Input>
				)}
				<CountButton onClick={addCount} disabled={userCount === MAX_USER_COUNT}>
					<HiOutlinePlus />
				</CountButton>
			</InnerWrapper>
			<StyledLink to={`/ladder/${userCount}`} className={`${viewType === "modify" && "disabled"}`}>
				<button>사다리타기</button>
			</StyledLink>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	gap: 10px;
`;

const CountButton = styled.button`
	padding: 10px;
	border: none;
	cursor: pointer;
	font-size: 20px;
`;

const Count = styled.p`
	display: flex;
	align-items: center;
	text-align: center;
	padding: 10px;
	font-size: 40px;
`;

const Input = styled.input`
	font-size: 40px;
	&::-webkit-outer-spin-button,
	&::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
`;

const InnerWrapper = styled.div`
	display: flex;
	width: 50%;
	height: 10%;
`;

const StyledLink = styled(Link)`
	&.disabled {
		pointer-events: none;
	}
`;
