import React, { useEffect, useState } from "react";
import "./App.css";
import { useAppDispatch, useAppSelector } from "./store/reduxHooks";
import { GET_FIELDS, GET_IDS, GET_ITEMS, SET_GOODS } from "./store/slice";
import LoadingPage from "./components/LoadingPage/LoadingPage";
import FilterField from "./components/FilterField/FilterField";
import GoodsWrapper from "./components/GoodsWrapper/GoodsWrapper";
import { Pagination } from "./UI_Component";

function App() {
  const { data, loading } = useAppSelector((state) => state.page);
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(GET_IDS());
    dispatch(GET_FIELDS("brand"));
    dispatch(GET_FIELDS("price"));
  }, []);
  useEffect(() => {
    if (data.ids.length) {
      dispatch(
        GET_ITEMS(data.ids.slice((currentPage - 1) * 50, currentPage * 50))
      );
    } else {
      dispatch(SET_GOODS([]));
    }
  }, [data.ids, currentPage]);

  if (loading == "COMPLICATED") {
    return (
      <div className="App">
        <div className="pageWrapper">
          <div className="filter">
            <FilterField />
          </div>
          <div className="goods">
            <GoodsWrapper />
            {data.goods.length > 0 && (
              <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                data={data.ids}
              />
            )}
          </div>
        </div>
      </div>
    );
  } else {
    return <LoadingPage />;
  }
}

export default App;
