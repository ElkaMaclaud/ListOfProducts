import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { IGoods } from "../type/IGoods";
import md5 from "md5";
export interface IInitialState {
	header: string;
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
	success: false,
	loading: "LOADING",
	data: {
		brand: [],
		price: [],
		ids: [],
		goods: []
	},
};
async function fetchDataWithRetry<T>(url: string, options: RequestInit, retryCount = 3) {
	let retries = 0;
	while (retries < retryCount) {
		try {
			const response = await fetch(url, options);
			if (!response.ok) {
				throw new Error("Что-то пошло не по-плану...");
			}
			const data: T = await response.json();
			return data;
		} catch (error) {
			retries++;
			if (retries === retryCount) {
				throw error;
			}
		}
	}
};
export const GET_IDS = createAsyncThunk("GET_IDS", async (_, { rejectWithValue }) => {
	const url = 'https://jewelry-3jyvalyvs-elkamaclaud-gmailcom.vercel.app';
	const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
	const xAuthValue = `${process.env.REACT_APP_PASSWORD}_${timestamp}`;
	const options: RequestInit = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"X-Auth": md5(xAuthValue)
		},
		body: JSON.stringify({
			action: "get_ids",
			params: { offset: 0 }
		})
	}

	try {
		const data = await fetchDataWithRetry<IResult>(url, options);
		return data;
	} catch (error) {
		console.error("Ошибка получения данных:", error);
		return rejectWithValue(error);
	}
});

export const GET_ITEMS = createAsyncThunk("GET_ITEMS", async (ids: string[], { rejectWithValue }) => {
	const url = 'https://jewelry-3jyvalyvs-elkamaclaud-gmailcom.vercel.app';
	const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
	const xAuthValue = `${process.env.REACT_APP_PASSWORD}_${timestamp}`;
	const options: RequestInit = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"X-Auth": md5(xAuthValue)
		},
		body: JSON.stringify({
			action: "get_items",
			params: { ids: ids }
		})
	}
	try {
		const data = await fetchDataWithRetry<IResultGoods>(url, options);
		return data;
	} catch (error) {
		console.error("Ошибка получения данных:", error);
		return rejectWithValue(error);
	}
});


export const GET_FIELDS = createAsyncThunk("GET_FIELDS", async (value: string, { rejectWithValue }) => {
	const url = 'https://jewelry-3jyvalyvs-elkamaclaud-gmailcom.vercel.app';
	const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
	const xAuthValue = (`${process.env.REACT_APP_PASSWORD}_${timestamp}`);
	const options: RequestInit = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"X-Auth": md5(xAuthValue)
		},
		body: JSON.stringify({
			action: "get_fields",
			params: { field: value, offset: 0 }

		})
	}
	try {
		const data = await fetchDataWithRetry<{result: string[]}>(url, options);
		return data?.result;
	} catch (error) {
		console.error("Ошибка получения данных:", error);
		return rejectWithValue(error);
	}
}
);
export const FILTER = createAsyncThunk("FILTER",
	async (value: [string, string | number],  { rejectWithValue }) => {
			const url = 'https://jewelry-3jyvalyvs-elkamaclaud-gmailcom.vercel.app';
			const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
			const xAuthValue = (`${process.env.REACT_APP_PASSWORD}_${timestamp}`);
			const options: RequestInit =  {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-Auth": md5(xAuthValue)
				},
				body: JSON.stringify({
					action: "filter",
					params: { [value[0]]: value[1] }

				})
			}
			try {
				const data = await fetchDataWithRetry<IResult>(url, options);
				return data;
			} catch (error) {
				console.error("Ошибка получения данных:", error);
				return rejectWithValue(error);
			}
	});


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
		builder.addCase(GET_IDS.fulfilled, (state, action) => {
			if (action.payload) {
				return {
					...state,
					header: "",
					data: {
						...state.data,
						ids: Array.from(new Set(action.payload.result))
					}
				};
			}
		});
		builder.addCase(GET_ITEMS.pending, (state) => {
			return {
				...state,
				loading: "LOADING",
			};
		});
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
		builder.addCase(FILTER.fulfilled, (state, action) => {
			if (action.payload) {
				const value = action.meta.arg;
				return {
					...state,
					header: value.toString(),
					data: {
						...state.data,
						ids: Array.from(new Set(action.payload.result))
					}
				};
			}
		});
	},
});

export default slice.reducer;
export const { LOADING_PAGE, SET_GOODS } = slice.actions;
