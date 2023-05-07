import { atom } from "jotai";

import { isLadderActive, isUserCountActive, isUserInformActive, userCount } from "./atoms";
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
