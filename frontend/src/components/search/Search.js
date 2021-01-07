import React, {useCallback, useState} from "react";
import debounce from "lodash/debounce";

import "./search.scss";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

//place fontawesome icon inside input element

const Search = ({setSearchValue, type}) => {

    const [keyword, setKeyword] = useState("");

    const delayedQuery = useCallback(debounce(keyword => {
        setSearchValue(keyword);
    }, 1000), []);

    const handleChange = event => {
        event.persist();
        setKeyword(event.target.value);
        delayedQuery(event.target.value);
    };

    return (
        <div className="search-container">
            <div className="elements">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder=" Search..."
                        value={keyword}
                        onChange={handleChange}/>
                    <i><FontAwesomeIcon icon={faSearch} size="lg"/></i>
                </div>
            </div>
            <div className="search-examples">
                <p> Searchable fields: {!type ? "" :
                type.map((word) => {
                    return <span key={word}>{word} </span>;
                })}
                </p>
            </div>
        </div>
    );
};

export default Search;

