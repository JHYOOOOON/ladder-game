import React, { useCallback } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import styled from "styled-components";

import { Card, LadderGame, UserCount, UserInform } from "../Components";
import { withIsActive, withUserCountActive, withUserInformActive } from "../States";

export function Home() {
	const isActive = useAtomValue(withIsActive);
	const setUserCountActive = useSetAtom(withUserCountActive);
	const setUserInformActive = useSetAtom(withUserInformActive);

	const handleUserCountClick = useCallback(() => {
		if (isActive.userCount) return;
		setUserCountActive(true);
	}, [isActive]);

	const handleUserInformActive = useCallback(() => {
		if (isActive.userCount || isActive.userInform) return;
		setUserInformActive(true);
	}, [isActive]);

	return (
		<Main>
			<LeftWrapper>
				<Card
					name="참여자 수"
					active={isActive.userCount}
					handleTitleClick={handleUserCountClick}
					disabled={isActive.userCount}
				>
					<UserCount />
				</Card>
				<Card
					name="사다리 정보"
					active={isActive.userInform}
					handleTitleClick={handleUserInformActive}
					disabled={isActive.userCount || isActive.userInform}
				>
					<UserInform />
				</Card>
			</LeftWrapper>
			<RightWrapper>
				<Card name="사다리 타기" active={isActive.ladder}>
					<LadderGame />
				</Card>
			</RightWrapper>
		</Main>
	);
}

const Main = styled.main`
	margin: 0 auto;
	max-width: 1800px;
	display: flex;
	gap: ${({ theme }) => theme.fontSize.xl}rem;
	${({ theme }) => theme.mediaQuery.tablet} {
		flex-direction: column;
	}
`;

const LeftWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.fontSize.xl}rem;
	flex: 0.3;
	min-width: 320px;
	max-width: 500px;
	${({ theme }) => theme.mediaQuery.tablet} {
		max-width: 100%;
	}
`;

const RightWrapper = styled.div`
	min-width: 320px;
	flex: 0.7;
`;
