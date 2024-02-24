import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { IGoods } from "../type/IGoods";
import md5 from "md5";

export interface IInitialState {
	header: string;
	getIdserror: boolean;
	getItemserror: boolean;
	success: boolean;
	loading: "LOADING" | "COMPLICATED";
	data: IData;

}
export interface IData {
	brand: string[];
	price: number[];
	ids: string[];
	goods: IGoods[];
}
interface IResult {
	result: string[];
}
interface IResultGoods {
	result: IGoods[];
}
const state: IInitialState = {
	header: "",
	getIdserror: false,
	getItemserror: false,
	success: false,
	loading: "LOADING",
	data: {
		brand: [],
		price: [],
		ids: [],
		goods: []
	},
};

export const GET_IDS = createAsyncThunk<
	IResult,
	undefined,
	{ rejectValue: string; state: RootState }
>(
	"page/GET_IDS",
	async (_, { rejectWithValue, getState }) => {
		try {
			const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
			const xAuthValue = `${process.env.REACT_APP_PASSWORD}_${timestamp}`;
			const response = await fetch("http://api.valantis.store:40000/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-Auth": md5(xAuthValue)
				},
				body: JSON.stringify({
					action: "get_ids",
					params: { offset: 0 }
				})
			});

			if (!response) {
				throw new Error("Network response was not ok");
			}

			const data = await response.json();
			return data as IResult;
		} catch (error) {
			console.log(error);
			return rejectWithValue(`${error}`);
		}
	}
);

export const GET_ITEMS = createAsyncThunk< 
	IResultGoods,
	string[],
	{ rejectValue: string }
>("page/GET_ITEMS",
	async (ids, { rejectWithValue }) => {
		try {
			const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
			const xAuthValue = (`${process.env.REACT_APP_PASSWORD}_${timestamp}`);
			const response = await fetch("http://api.valantis.store:40000/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-Auth": md5(xAuthValue)
				},
				body: JSON.stringify({
					action: "get_items",
					params: { ids: ids }

				})
			});
			if (!response) {
				throw new Error("Network response was not ok");
			}
			const data = await response.json() as IResultGoods;
			return data;
		} catch (error) {
			console.log(error);
			return rejectWithValue(`${error}`);
		}
	}
);
export const GET_FIELDS = createAsyncThunk<
	string[],
	string,
	{ rejectValue: string }
>("page/GET_FIELDS",
	async (value, { rejectWithValue }) => {
		try {
			const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
			const xAuthValue = (`${process.env.REACT_APP_PASSWORD}_${timestamp}`);
			const response = await fetch("http://api.valantis.store:40000/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-Auth": md5(xAuthValue)
				},
				body: JSON.stringify({
					action: "get_fields",
					params: { field: value, offset: 0 }

				})
			});
			if (!response) {
				throw new Error("Network response was not ok");
			}
			const data = await response.json();
			return data.result;
		} catch (error) {
			console.log(error);
			return rejectWithValue(`${error}`);
		}
	}
);
export const FILTER = createAsyncThunk<
	IResult,
	[string, string | number],
	{ rejectValue: string }
>("page/FILTER",
	async (value, { rejectWithValue }) => {
		try {
			const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
			const xAuthValue = (`${process.env.REACT_APP_PASSWORD}_${timestamp}`);
			const response = await fetch("http://api.valantis.store:40000/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-Auth": md5(xAuthValue)
				},
				body: JSON.stringify({
					action: "filter",
					params: { [value[0]]: value[1] }

				})
			});
			if (!response) {
				throw new Error("Network response was not ok");
			}
			const data = await response.json();
			return data;
		} catch (error) {
			console.log(error);
			return rejectWithValue(`${error}`);
		}
	}
);


const slice = createSlice({
	name: "Page",
	initialState: state,
	reducers: {
		LOADING_PAGE: (state, action) => {
			state.loading = action.payload;
		},
		SET_GOODS: (state, action) => {
			state.data.goods = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(GET_IDS.pending, (state, action) => {
			if (action.payload) {
				return {
					...state,
					loading: "LOADING",
				};
			}
		});
		builder.addCase(GET_IDS.rejected, (state, action) => {
			if (action.payload) {
				return {
					...state,
					getIdserror: true,
				};
			}
		});
		builder.addCase(GET_IDS.fulfilled, (state, action) => {
			if (action.payload) {
				return {
					...state,
					header: "",
					data: {
						...state.data,
						getIdserror: false,
						ids: Array.from(new Set(action.payload.result))
					}
				};
			}
		});
		builder.addCase(GET_ITEMS.pending, (state) => {
			return {
				...state,
				getItemserror: false,
				loading: "LOADING",
			};
		});
		builder.addCase(GET_ITEMS.rejected, (state) => {
			return {
				...state,
				getItemserror: true,
			};
		})
		builder.addCase(GET_ITEMS.fulfilled, (state, action) => {
			if (action.payload) {
				const uniqueGoods: IGoods[] = [];
				const set = new Set();
				action.payload.result.forEach((item) => {
					if (!set.has(item.id)) {
						set.add(item.id);
						uniqueGoods.push(item);
					}
				});
				return {
					...state,
					getItemserror: false,
					loading: "COMPLICATED",
					data: {
						...state.data,
						goods: uniqueGoods
					}
				};
			}
		});

		builder.addCase(GET_FIELDS.fulfilled, (state, action) => {
			if (action.payload) {
				const value = action.meta.arg;
				return {
					...state,
					data: {
						...state.data,
						[value]: Array.from(new Set(action.payload.filter(brand => brand !== null)))
					}
				};

			}
		});
		builder.addCase(FILTER.pending, (state, action) => {
			if (action.payload) {
				return {
					...state,
					loading: "LOADING",
				};
			}
		});
		builder.addCase(FILTER.rejected, (state, action) => {
			if (action.payload) {
				return {
					...state,
					getIdserror: true,
				};
			}
		});
		builder.addCase(FILTER.fulfilled, (state, action) => {
			if (action.payload) {
				const value = action.meta.arg;
				return {
					...state,
					header: value.toString(),
					data: {
						...state.data,
						getIdserror: false,
						ids: Array.from(new Set(action.payload.result))
					}
				};
			}
		});
	},





});

export default slice.reducer;
export const { LOADING_PAGE, SET_GOODS } = slice.actions;
