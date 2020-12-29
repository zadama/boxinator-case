
//Example component for how to add search-component to page:

import React, {useEffect, useRef, useState} from 'react';
import Search from "./Search";
//Make a component where you render list of all accounts/shipments/country -> e.g. see CountryList.js
//import ExampleList from "./ExampleList";

const ExamplePage = () => {
    //Add these to main component:
    const firstUpdate = useRef(true);
    const [searchValue, setSearchValue] = useState("");
    const [exList, setExList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);

//Add useEffect function to mainPage:

    //first time useEffect will get the ExList, then everytime searchValue  is updated the filtered List will rerender
    useEffect( () => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            //initial api call goes here to fetch all objects();
            return;
        } else {
            const filtered = exList.filter(object => {
                return (
                    object.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                    (object.id + "") === searchValue ||
                    object.countryCode.toLowerCase().includes(searchValue.toLowerCase())
                );
            });
            setFilteredList(filtered);
        }
    }, [searchValue]);

    return (
        <div>
            <Search setSearchValue={setSearchValue}/>
            <ExampleList filteredList={filteredList}
                         updateObject={localMethodForHandleUpdateObject}
                         deleteObject={localMethodForHandleDeleteObject}
            />
        </div>
    )
}

export default ExamplePage;

