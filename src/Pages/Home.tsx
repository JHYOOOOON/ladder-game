import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { HiOutlineMinus, HiOutlinePlus } from "react-icons/hi";
import { MAX_USER_COUNT, MIN_USER_COUNT } from "../constants";

type VIEW_TYPE = "modify" | "view";

export const Home = () => {
	const [viewType, setViewType] = useState<VIEW_TYPE>("view");
	const [userCount, setUserCount] = useState(MIN_USER_COUNT);
	const [modifyCount, setModifyCount] = useState(MIN_USER_COUNT);
	const textRef = useRef<HTMLInputElement>(null);

	const addCount = () =>
		setUserCount((prevValue) => {
			setModifyCount(prevValue + 1);
			return prevValue + 1;
		});

	const minusCount = () =>
		setUserCount((prevValue) => {
			setModifyCount(prevValue - 1);
			return prevValue - 1;
		});

	const changeToView = () => {
		setViewType("view");
		if (modifyCount < MIN_USER_COUNT) {
			setUserCount(MIN_USER_COUNT);
			setModifyCount(MIN_USER_COUNT);
			return;
		}
		if (modifyCount > MAX_USER_COUNT) {
			setUserCount(MAX_USER_COUNT);
			setModifyCount(MAX_USER_COUNT);
			return;
		}
		setUserCount(modifyCount);
	};

	useEffect(() => {
		const handleClick = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			if (target.classList.contains("count") === false) {
				changeToView();
			}
		};

		document.addEventListener("click", handleClick);

		return () => document.removeEventListener("click", handleClick);
	}, [modifyCount]);

	useEffect(() => {
		if (viewType === "modify") {
			if (!textRef.current) return;
			textRef.current.focus();
			textRef.current.setSelectionRange(0, textRef.current.value.length);
		}
	}, [viewType]);

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
						type="text"
						className="count"
						value={modifyCount}
						ref={textRef}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								changeToView();
							}
						}}
						onChange={(e) => {
							const value = Number(e.target.value);
							if (isNaN(value)) {
								return;
							}
							setModifyCount(value);
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
