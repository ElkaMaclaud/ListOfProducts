import React, {	FC, memo } from "react";
import classes from "./style/WideCard.module.css";
import { IGoods } from "../../type/IGoods";
import ImageCard from "../../UI_Component/ImageCard/ImageCard";

export const WideCard: FC<{
	good: IGoods;
}> = memo(({ good }) => {
	return (
		<div className={classes.wrapperCard}>
			<h2>{good.product}</h2>
			<div className={classes.wrapper}>
				<ImageCard />
				<div className={classes.description}>
					{good.brand && <div className={classes.brand}>Бренд: <h4>{good.brand}</h4></div>}
					<div className={classes.price}>Цена: <h4>{good.price} ₽</h4></div>
					<div>id: {good.id}</div>
				</div>
			</div>
		</div>
	);
});
