import { useAtom } from "jotai";

import { withResultName } from "../States";
import { Input } from "./Common";

interface IResultName {
	index: number;
}

export function ResultName({ index }: IResultName) {
	const [resultName, setResultName] = useAtom(withResultName(index));
	return <Input value={resultName || ""} onChange={(event) => setResultName(event.target.value)} />;
}
