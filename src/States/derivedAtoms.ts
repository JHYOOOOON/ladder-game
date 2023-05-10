import { atom } from "jotai";
import { atomFamily } from "jotai/utils";

import { isLadderActive, isUserCountActive, isUserInformActive, resultName, userCount, userName } from "./atoms";
import { UserCount } from "./types";

export const withUserCount = atom(
	(get) => get(userCount),
	(get, set, newCount: UserCount) => {
		set(userCount, newCount);
	}
);

export const withUserCountActive = atom(
	(get) => get(isUserCountActive),
	(get, set, active: boolean) => {
		set(isUserCountActive, active);
	}
);

export const withUserInformActive = atom(
	(get) => get(isUserInformActive),
	(get, set, active: boolean) => {
		set(isUserInformActive, active);
	}
);

export const withLadderActive = atom(
	(get) => get(isLadderActive),
	(get, set, active: boolean) => {
		set(isLadderActive, active);
	}
);

export const withIsActive = atom((get) => ({
	userCount: get(isUserCountActive),
	userInform: get(isUserInformActive),
	ladder: get(isLadderActive),
}));

export const withInitialUserName = atom(null, (get, set, newValue: number) =>
	set(
		userName,
		Array.from({ length: newValue }, (_, index) => `참여자${index + 1}`)
	)
);

export const withInitialResultName = atom(null, (get, set, newValue: number) =>
	set(
		resultName,
		Array.from({ length: newValue }, (_, index) => "꽝")
	)
);

export const withUserNames = atom((get) => get(userName));

export const withResultNames = atom((get) => get(resultName));

export const withUserName = atomFamily((index: number) =>
	atom(
		(get) => get(userName)[index],
		(get, set, newValue: string) => {
			const prev = get(userName);
			set(userName, [...prev.slice(0, index), newValue, ...prev.slice(index + 1)]);
			return newValue;
		}
	)
);

export const withResultName = atomFamily((index: number) =>
	atom(
		(get) => get(resultName)[index],
		(get, set, newValue: string) => {
			const prev = get(resultName);
			set(resultName, [...prev.slice(0, index), newValue, ...prev.slice(index + 1)]);
			return newValue;
		}
	)
);
