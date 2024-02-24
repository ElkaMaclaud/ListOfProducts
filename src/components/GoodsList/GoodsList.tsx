import React, { CSSProperties, FC } from "react";
import { WideCard } from "../WideCard/WideCard";
import { IGoods } from "../../type/IGoods";

const GoodsList: FC<{
	data: IGoods[];
}> = ({ data}) => {
	const style: CSSProperties = {
		display: "flex",
		backgroundColor: "transparent",
		justifyContent: "center",
		gap: ".5rem",
		marginTop: "20px",
		flexWrap: "wrap",
	}
	return (
		<div style={style}>
			{data.map((item) => {
				return <WideCard key={item.id} good={item} />;
			})}
		</div>
	);
};

export default GoodsList;
