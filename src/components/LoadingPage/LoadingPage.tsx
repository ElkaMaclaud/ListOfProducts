import React from "react";
import classes from "./style/LoadingPage.module.css";

const Building = () => {
	const list = Array.from({ length: 16 });
	return (
		<div className={classes.container}>
			<div className={classes.content}>
				{list.map((item, index) => {
					return (
						<div key={index} className={classes.cuboid}>
							<div className={classes.side}></div>
							<div className={classes.side}></div>
							<div className={classes.side}></div>
							<div className={classes.side}></div>
							<div className={classes.side}></div>
							<div className={classes.side}></div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default Building;

