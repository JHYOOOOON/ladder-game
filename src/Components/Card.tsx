import styled from "styled-components";

interface ICard {
	active: boolean;
	name: string;
	children: React.ReactNode;
}

export function Card({ active, children, name }: ICard) {
	return (
		<Wrapper>
			<Title>{name}</Title>
			{active && <Content>{children}</Content>}
		</Wrapper>
	);
}

const Wrapper = styled.section`
	border-radius: ${({ theme }) => theme.fontSize.xxs}rem;
	box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
	overflow: hidden;
`;

const Title = styled.p`
	padding: ${({ theme }) => theme.fontSize.base}rem ${({ theme }) => theme.fontSize.lg}rem;
	font-size: ${({ theme }) => theme.fontSize.xxl}rem;
	font-weight: bold;
`;

const Content = styled.div`
	position: relative;
	padding: ${({ theme }) => theme.fontSize.xxl}rem ${({ theme }) => theme.fontSize.lg}rem;
	&::before {
		position: absolute;
		top: 0;
		left: 0;
		margin: 0 ${({ theme }) => theme.fontSize.xs}rem;
		content: "";
		width: -webkit-fill-available;
		height: 1px;
		background-color: #ddd;
	}
`;
