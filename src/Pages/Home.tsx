import React from "react";
import { useAtomValue } from "jotai";
import styled from "styled-components";

import { Card, LadderGame, UserCount, UserInform } from "../Components";
import { withIsActive } from "../States";

export function Home() {
	const isActive = useAtomValue(withIsActive);

	return (
		<Main>
			<LeftWrapper>
				<Card name="참여자 수" active={isActive.userCount}>
					<UserCount />
				</Card>
				<Card name="사다리 정보" active={isActive.userInform}>
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
	flex: 1;
	min-width: 320px;
	max-width: 500px;
	${({ theme }) => theme.mediaQuery.tablet} {
		max-width: 100%;
	}
`;

const RightWrapper = styled.div`
	min-width: 320px;
	flex: 1;
`;
