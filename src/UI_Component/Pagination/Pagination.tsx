import React, { Dispatch, FC, SetStateAction } from "react";
import classes from "./style/Pagination.module.css"
import { Arrow } from "../Icons/Arrow/Arrow";

type PaginationProps = {
	currentPage: number;
	setCurrentPage: Dispatch<SetStateAction<number>>;
	data: string[];
};
const Pagination: FC<PaginationProps> = ({ currentPage, setCurrentPage, data }) => {
	const countGoods = 50;

	const indexLastPage = currentPage * countGoods;

	const nextPage = () => setCurrentPage(currentPage + 1);
	const prevPage = () => setCurrentPage(currentPage - 1);

	const middle = Math.ceil(data.length / countGoods);

	const getPageNumbers = () => {
		const pages = Array.from({ length: middle });
		return pages.map((_, i) => i).slice(1);
	};

	if (data.length <= countGoods) {
		return null
	}
	else {
		return (
			<div className={classes.wrapper}>
				<button className={classes.arrow} onClick={prevPage} disabled={currentPage === 1}>
					<Arrow left />
				</button>
				{currentPage - 2 > 1 && <span>...</span>}
				{getPageNumbers()
					.filter(page => page >= currentPage - 2 && page <= currentPage + 2)
					.map(page => (
						<button className={page == currentPage ? classes.active : classes.button} key={page}
							onClick={() => setCurrentPage(page)}>
							{page}
						</button>
					))}
				{currentPage + 2 < middle && <span>...</span>}
				<button className={classes.arrow} onClick={nextPage} disabled={indexLastPage >= data.length}>
					<Arrow />
				</button>
			</div>
		);
	}
};

export default Pagination;