import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "../Pages";

export const Router = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />}></Route>
			</Routes>
		</BrowserRouter>
	);
};
