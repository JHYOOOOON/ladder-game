import styled from "styled-components";
import { PrimaryButton, SecondaryButton } from "./Common";
import { useState } from "react";
import { Matches } from "./LadderGame";

type ResultSectionProps = {
	matches: Matches;
};

export function ResultSection({ matches }: ResultSectionProps) {
	const [showResult, setShowResult] = useState(false);

	return (
		<>
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
		</>
	);
}

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
