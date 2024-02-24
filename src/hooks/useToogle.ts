import { useState } from "react";

type ToggleReturnType = [boolean, () => void];

function useToggle(initialValue: boolean): ToggleReturnType {
	const [value, setValue] = useState(initialValue);

	const toggle = () => {
		setValue(!value);
	};

	return [value, toggle];
}

export { useToggle };
