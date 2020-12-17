import React, {useState, useEffect} from "react";

const Search = ({keyword, setKeyword}) => {


    return (
        <div className="search-container">
            <h3>Search</h3>
            <div>
                <input
                    className="search-bar"
                    value={keyword}
                    placeholder="Search..."/>

            </div>
        </div>
    );
};

export default Search;

