import styled, { css } from "styled-components";

export const Input = styled.input`
	border: 1px solid #999;
	border-radius: 3px;
	margin-right: 5px;
	font-size: ${({ theme }) => theme.fontSize.sm}rem;
	padding: 3px 5px;
	transition: 0.2s border;
	&:focus {
		outline: none;
		border: 1px solid ${({ theme }) => theme.color.primary};
	}
`;

const Button = css`
	padding: 3px 10px;
	min-width: 70px;
	border: none;
	border-radius: 3px;
	font-size: ${({ theme }) => theme.fontSize.base}rem;
	color: #fff;
	&:hover {
		box-shadow: inset 9rem 0 0 0 #fff;
	}
	transition: 0.2s;
	cursor: pointer;
`;

export const PrimaryButton = styled.button`
	${Button}
	border: 2px solid ${({ theme }) => theme.color.primary};
	background-color: ${({ theme }) => theme.color.primary};
	&:hover {
		color: ${({ theme }) => theme.color.primary};
	}
`;

export const SecondaryButton = styled.button`
	${Button}
	border: 2px solid ${({ theme }) => theme.color.primary400};
	background-color: ${({ theme }) => theme.color.primary400};
	&:hover {
		color: ${({ theme }) => theme.color.primary400};
	}
`;
