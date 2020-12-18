import React from "react";
import "./search.scss";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


const Search = ({keyword, setKeyword}) => {

const handleChange = event => {
    setKeyword(event.target.value)
}

    return (
        <div className="search-container">
            <h3>Search</h3>
            <div>
                <input
                    className="search-bar"
                    type="text"
                    placeholder="Search..."
                    value={keyword}
                    onChange={handleChange}/>
                    <button className="btn btn-info ml-2 search-icon">
                        <FontAwesomeIcon icon={faSearch} size="lg"/>
                    </button>
            </div>
        </div>
    );
};

export default Search;

