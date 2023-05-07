import { atom } from "jotai";

import { IsActive, UserCount } from "./types";
import { MIN_USER_COUNT } from "../constants";

export const userCount = atom<UserCount>(MIN_USER_COUNT);

export const isUserCountActive = atom<IsActive>(true);

export const isUserInformActive = atom<IsActive>(false);

export const isLadderActive = atom<IsActive>(false);
