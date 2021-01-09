import React from "react";
import "../style.scss";
import ColorPicker from "./ColorPicker";
import Select from "react-select";
import { useEffect, useState } from "react";
import { getAllCountries } from "../../../api/countries";
import PageLoader from "../../../components/loader";

const sourceCountries = [
  {
    label: "Sweden",
    value: "Sweden",
  },
  {
    label: "Denmark",
    value: "Denmark",
  },
  {
    label: "Norway",
    value: "Norway",
  },
];

const ShipmentForm = ({ state, handleChange, setColorValue, errors }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [savedCountries, setSavedCountries] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      let response = await getAllCountries();
      let { data: savedCountries } = response.data;

      savedCountries = savedCountries.map((obj) => {
        return {
          label: obj.name,
          value: obj.name,
          feeMultiplier: obj.feeMultiplier,
        };
      });

      setSavedCountries(savedCountries);
      setIsLoading(false);
    };

    fetchCountries();
  }, []);

  const onHandleColorPicker = (color) => {
    setColorValue(color.hex);
  };

  return (
    <div className="shipment-form-container">
      {isLoading ? (
        <PageLoader />
      ) : (
        <>
          <div className="shipment-form-group">
            <label className="label">Receiver</label>
            <input
              type="text"
              name="receiver"
              placeholder="Receiver"
              className="input"
              value={state.receiver}
              onChange={handleChange}
            ></input>
            {errors.receiver && (
              <span className="error-span">{errors.receiver}</span>
            )}
          </div>

          <div className="shipment-form-group">
            <label className="label">Source Country</label>
            <Select
              className="select-picker"
              placeholder={"Select source country"}
              options={sourceCountries}
              onChange={handleChange}
              isSearchable={false}
            />
            {errors.sourceCountry && (
              <span className="error-span">{errors.sourceCountry}</span>
            )}
          </div>

          <div className="shipment-form-group">
            <label className="label">Destination Country</label>

            <Select
              className="select-picker"
              placeholder={"Select destination country"}
              options={savedCountries}
              onChange={handleChange}
              isSearchable={false}
            />

            {errors.destinationCountry && (
              <span className="error-span">{errors.destinationCountry}</span>
            )}
          </div>
          <div className="shipment-form-group">
            <label className="label">Box Color</label>
            <ColorPicker onHandleColorPicker={onHandleColorPicker} />
            {errors.colorValue && (
              <span className="error-span">{errors.colorValue}</span>
            )}
          </div>
          <div className="shipment-form-group">
            <label className="label">Weight</label>
            <input
              type="text"
              name="boxWeight"
              placeholder="Box weight"
              className="input"
              value={state.boxWeight}
              onChange={(e) => {
                let value = e.target.value;

                if (Number(value) || value === "") {
                  handleChange(e);
                }
              }}
            ></input>
            {errors.boxWeight && (
              <span className="error-span">{errors.boxWeight}</span>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ShipmentForm;
