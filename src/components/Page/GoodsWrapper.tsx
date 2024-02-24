import React from "react";
import classes from "./style/GoodsWrapper.module.css";
import GoodsList from "../GoodsList/GoodsList";
import { useAppSelector } from "../../store/reduxHooks";
import { Up } from "../../UI_Component/Up/Up";
import { Search } from "../Search/Search";


const GoodsWrapper = () => {
	const { header, data } = useAppSelector((state) => state.page);
	if (data.goods.length) {
		return (
			<div className={classes.wrapperPage}>
				<h1>Все товары {header ? `: ${header}` : ""}</h1>
				<Search str={header.split(",")[0] == "product" ? header.split(",")[1] : ""} />
				<div className={classes.content}>
					<GoodsList
						data={data.goods}
					/>
					<div className={classes.scrollUp}><Up /></div>
				</div>
			</div>
		);
	} else {
		return (
			<div className={classes.wrapperPage}>
				<h1>Здесь ничего нет</h1>
				<Search str={header.split(",")[0] == "product" ? header.split(",")[1] : ""} />
			</div>
		)
	}

};

export default GoodsWrapper;