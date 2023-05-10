import { useEffect, useRef } from "react";
import { useAtom } from "jotai";

import { withResultName } from "../States";
import { Input } from "./Common";

interface IResultName {
	index: number;
}

export function ResultName({ index }: IResultName) {
	const [resultName, setResultName] = useAtom(withResultName(index));
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (!inputRef.current) return;

		const handleBlankInput = () => {
			if (resultName.trim() === "") {
				setResultName("꽝");
			}
		};

		inputRef.current.addEventListener("blur", handleBlankInput);

		return () => inputRef.current?.removeEventListener("blur", handleBlankInput);
	}, [resultName]);

	return <Input ref={inputRef} value={resultName || ""} onChange={(event) => setResultName(event.target.value)} />;
}
