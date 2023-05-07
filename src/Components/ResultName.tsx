import { useAtom } from "jotai";

import { withResultName } from "../States";

interface IResultName {
	index: number;
}

export function ResultName({ index }: IResultName) {
	const [resultName, setResultName] = useAtom(withResultName(index));
	return <input value={resultName || ""} onChange={(event) => setResultName(event.target.value)} />;
}
