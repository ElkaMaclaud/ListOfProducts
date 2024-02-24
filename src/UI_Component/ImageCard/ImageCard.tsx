import React from "react"
import classes from "./style/ImageCard.module.css"

const ImageCard = () => {
	return (
		<div className={classes.wrapper}>
			<img className={classes.img} src="https://gcity08.ru/image/cache/catalog/products/br110048i_132830-500x500.jpg" alt="Кольцо" />
		</div>
	)
}

export default ImageCard