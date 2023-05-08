import { useEffect, useRef } from "react";
import { useAtom } from "jotai";

import { withUserName } from "../States";
import { Input } from "./Common";

interface IUserName {
	index: number;
}

export function UserName({ index }: IUserName) {
	const [userName, setUserName] = useAtom(withUserName(index));
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (!inputRef.current) return;

		const handleBlankInput = () => {
			if (userName.trim() === "") {
				setUserName(`참여자${index + 1}`);
			}
		};

		inputRef.current.addEventListener("blur", handleBlankInput);

		return () => inputRef.current?.removeEventListener("blur", handleBlankInput);
	}, [userName]);

	return <Input ref={inputRef} value={userName || ""} onChange={(event) => setUserName(event.target.value)} />;
}
