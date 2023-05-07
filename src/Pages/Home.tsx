import { Card, UserCount } from "../Components";

export function Home() {
	return (
		<main>
			<div>
				<Card name="사용자 수" active={true}>
					<UserCount />
				</Card>
			</div>
		</main>
	);
}
