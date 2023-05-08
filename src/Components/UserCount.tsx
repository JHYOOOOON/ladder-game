import { useCallback, useEffect, useRef, useState } from "react";
import { HiOutlineMinus, HiOutlinePlus } from "react-icons/hi";
import styled from "styled-components";
import { useAtom, useSetAtom } from "jotai";

import { MAX_USER_COUNT, MIN_USER_COUNT } from "../constants";
import { withUserCount, withUserCountActive, withUserInformActive } from "../States";
import { PrimaryButton } from "./Common";

type VIEW_TYPE = "modify" | "view";

export function UserCount() {
	const [viewType, setViewType] = useState<VIEW_TYPE>("view");
	const [modifyCount, setModifyCount] = useState(MIN_USER_COUNT);
	const [userCount, setUserCount] = useAtom(withUserCount);
	const setIsActive = useSetAtom(withUserCountActive);
	const setUserNameActive = useSetAtom(withUserInformActive);
	const textRef = useRef<HTMLInputElement>(null);

	const addCount = useCallback(() => {
		if (viewType === "modify") return;
		setUserCount(userCount + 1);
		setModifyCount(userCount + 1);
	}, [userCount, viewType]);

	const minusCount = useCallback(() => {
		if (viewType === "modify") return;
		setUserCount(userCount - 1);
		setModifyCount(userCount - 1);
	}, [userCount, viewType]);

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

	const handleClickNextButton = () => {
		if (viewType === "modify") {
			changeToView();
		}
		setIsActive(false);
		setUserNameActive(true);
	};

	useEffect(() => {
		const handleClick = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			if (viewType === "modify" && target.closest(".count") === null) {
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
			<PrimaryButton onClick={handleClickNextButton}>다음</PrimaryButton>
		</Wrapper>
	);
}

const Wrapper = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	gap: ${({ theme }) => theme.fontSize.xxs}rem;
`;

const CountButton = styled.button`
	padding: ${({ theme }) => theme.fontSize.xxs}rem;
	border: none;
	cursor: pointer;
	font-size: ${({ theme }) => theme.fontSize.xl}rem;
`;

const Count = styled.p`
	display: flex;
	align-items: center;
	justify-content: center;
	width: ${({ theme }) => theme.fontSize.xxxl}rem;
	padding: ${({ theme }) => theme.fontSize.xxs}rem;
	font-size: ${({ theme }) => theme.fontSize.xxl}rem;
`;

const Input = styled.input`
	width: ${({ theme }) => theme.fontSize.xxxl}rem;
	padding: 0 ${({ theme }) => theme.fontSize.xxs}rem;
	font-size: ${({ theme }) => theme.fontSize.xxl}rem;
	text-align: center;
	&::-webkit-outer-spin-button,
	&::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
`;

const InnerWrapper = styled.div`
	display: flex;
`;
