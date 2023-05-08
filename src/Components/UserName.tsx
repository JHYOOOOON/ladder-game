import { useAtom } from "jotai";

import { withUserName } from "../States";
import { Input } from "./Common";

interface IUserName {
	index: number;
}

export function UserName({ index }: IUserName) {
	const [userName, setUserName] = useAtom(withUserName(index));

	return <Input value={userName || ""} onChange={(event) => setUserName(event.target.value)} />;
}
