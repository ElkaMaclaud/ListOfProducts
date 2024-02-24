import React, { ChangeEvent, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../store/reduxHooks"
import classes from "./style/FilterField.module.css"
import { FILTER, GET_IDS } from "../../store/slice"

const FilterField = () => {
	const { data, header } = useAppSelector(state => state.page)
	const { brand, price } = data
	const value = header.split(",")
	const [checkedItems, setCheckedItems] = useState<Record<string, string | number>>(
		value.length > 0 ? { [value[0]]: value[1] } : {});
	const dispatch = useAppDispatch()
	const [filter, setFilter] = useState(false)

	const onChange = (filterName: string, name: string | number) => {
		setCheckedItems({ [filterName]: name });
		dispatch(FILTER([filterName, name]))
	};
	const resetFilter = (e: ChangeEvent<HTMLInputElement>) => {
		setFilter(e.target.checked)
		if (e.target.checked && header) {
			setTimeout(() => {
				dispatch(GET_IDS())
			}, 20)
		}
	};
	return (
		<div className={classes.wrapper}>
			{header && <div className={classes.item}>
				<h3>Очистить фильтры</h3>
				<label className={classes.switch}>
					<input type="checkbox" onChange={(e) => resetFilter(e)} checked={filter} />
					<span className={classes.slider}></span>
				</label>
			</div>}
			<h3>Бренды</h3>
			<div className={classes.itemWrapper}>
				{brand && brand.map((brand) => {
					return (
						<label key={brand} htmlFor={`${brand}`} className={classes.item}>
							<input
								type="checkbox"
								id={brand}
								onChange={() => onChange("brand", brand)}
								checked={checkedItems["brand"] == brand || false}
							/>
							<div className={classes.filterName}>{brand}</div>
						</label>
					)
				}
				)}
			</div>
			<h3>Цены</h3>
			<div className={classes.itemWrapper}>
				{price && price.map((price) => {
					return (
						<label key={price} htmlFor={`${price}`} className={classes.item}>
							<input
								type="checkbox"
								id={price.toString()}
								onChange={() => onChange("price", price)}
								checked={checkedItems["price"] == price || false}
							/>
							<div className={classes.filterName}>{price}</div>
						</label>
					)
				}
				)}
			</div>
		</div>
	)
}

export default FilterField
