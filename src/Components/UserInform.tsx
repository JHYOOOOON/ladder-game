import { useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";

import {
	withInitialResultName,
	withInitialUserName,
	withLadderActive,
	withUserCount,
	withUserCountActive,
	withUserInformActive,
} from "../States";
import { UserName, ResultName } from ".";

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
			<article>
				<p>참여자</p>
				<div>
					{Array.from({ length: userCount }).map((_, index) => (
						<UserName index={index} key={`userName_${index}`} />
					))}
				</div>
			</article>
			<article>
				<p>결과</p>
				{Array.from({ length: userCount }).map((_, index) => (
					<ResultName index={index} key={`resultName_${index}`} />
				))}
			</article>
			<div>
				<button onClick={handleClickPrev}>이전</button>
				<button onClick={handleClickNext}>다음</button>
			</div>
		</section>
	);
}
