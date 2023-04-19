import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home, Ladder } from "../Pages";

export const Router = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />}></Route>
				<Route path="/ladder/:count" element={<Ladder />}></Route>
			</Routes>
		</BrowserRouter>
	);
};
