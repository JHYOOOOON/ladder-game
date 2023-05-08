import { useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import styled from "styled-components";

import {
	withInitialResultName,
	withInitialUserName,
	withLadderActive,
	withUserCount,
	withUserCountActive,
	withUserInformActive,
} from "../States";
import { UserName, ResultName } from ".";
import { PrimaryButton, SecondaryButton } from "./Common";

export function UserInform() {
	const userCount = useAtomValue(withUserCount);
	const setInitialUserName = useSetAtom(withInitialUserName);
	const setInitialResultName = useSetAtom(withInitialResultName);
	const setIsActive = useSetAtom(withUserInformActive);
	const setUserCountActive = useSetAtom(withUserCountActive);
	const setLadderAcive = useSetAtom(withLadderActive);

	useEffect(() => {
		setInitialUserName(userCount);
		setInitialResultName(userCount);
	}, [userCount]);

	const handleClickPrev = () => {
		setIsActive(false);
		setUserCountActive(true);
	};

	const handleClickNext = () => {
		setIsActive(false);
		setLadderAcive(true);
	};

	return (
		<section>
			<Article>
				<Title>참여자</Title>
				<div>
					{Array.from({ length: userCount }).map((_, index) => (
						<UserName index={index} key={`userName_${index}`} />
					))}
				</div>
			</Article>
			<Article>
				<Title>결과</Title>
				{Array.from({ length: userCount }).map((_, index) => (
					<ResultName index={index} key={`resultName_${index}`} />
				))}
			</Article>
			<ButtonWrapper>
				<SecondaryButton onClick={handleClickPrev}>이전</SecondaryButton>
				<PrimaryButton onClick={handleClickNext}>다음</PrimaryButton>
			</ButtonWrapper>
		</section>
	);
}

const Title = styled.p`
	font-size: ${({ theme }) => theme.fontSize.lg}rem;
	margin-bottom: ${({ theme }) => theme.fontSize.xxs}rem;
`;

const Article = styled.article`
	margin-bottom: ${({ theme }) => theme.fontSize.base}rem;
`;

const ButtonWrapper = styled.div`
	display: flex;
	justify-content: center;
	gap: ${({ theme }) => theme.fontSize.xxs}rem;
`;
