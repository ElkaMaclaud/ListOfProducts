import React, { useRef, useState } from "react";
import { useAppDispatch } from "../../store/reduxHooks";
import classes from "./style/Search.module.css"
import { FILTER } from "../../store/slice";

export const Search = ({str}: {str: string}) => {
	const [value, setValue] = useState(str)
	const prevValueRef = useRef<string>();
	const timerRef = useRef<NodeJS.Timeout | undefined>();
	const dispatch = useAppDispatch()
	
	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.currentTarget.value !== prevValueRef.current) {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
			}
			prevValueRef.current = event.currentTarget.value;
			if (prevValueRef.current) {
				setValue(event.target.value)
				timerRef.current = setTimeout(() => {
					dispatch(FILTER(["product", event.target.value]))
				}, 1000);
			}
		}
	};
	return (
		<label>
			<input className={classes.search}
				placeholder="Поиск..."
				type="search"
				onChange={handleSearch}
				value={value}
			/>

		</label>)
}