import { useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";

import { withInitialResultName, withInitialUserName, withUserCount } from "../States";
import { UserName, ResultName } from ".";

export function UserInform() {
	const userCount = useAtomValue(withUserCount);
	const setInitialUserName = useSetAtom(withInitialUserName);
	const setInitialResultName = useSetAtom(withInitialResultName);

	useEffect(() => {
		setInitialUserName(userCount);
		setInitialResultName(userCount);
	}, [userCount]);

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
				<button>이전</button>
				<button>다음</button>
			</div>
		</section>
	);
}
