import { useAtom } from "jotai";
import { withUserName } from "../States";

interface IUserName {
	index: number;
}

export function UserName({ index }: IUserName) {
	const [userName, setUserName] = useAtom(withUserName(index));
	return <input value={userName || ""} onChange={(event) => setUserName(event.target.value)} />;
}
