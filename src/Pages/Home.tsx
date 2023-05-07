import React from "react";
import { useAtomValue } from "jotai";
import styled from "styled-components";

import { Card, UserCount } from "../Components";
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
					<UserCount />
				</Card>
			</LeftWrapper>
			<RightWrapper>
				<Card name="사다리 타기" active={isActive.ladder}>
					<UserCount />
				</Card>
			</RightWrapper>
		</Main>
	);
}

const Main = styled.main`
	display: flex;
	gap: ${({ theme }) => theme.fontSize.xl}rem;
`;

const LeftWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.fontSize.xl}rem;
	flex: 1;
`;

const RightWrapper = styled.div`
	flex: 1;
`;
