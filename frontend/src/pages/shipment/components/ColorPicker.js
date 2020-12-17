import React, { useState } from "react";
import { ChromePicker } from "react-color";

const ColorPicker = ({ onHandleColorPicker }) => {
  const [displayColorPicker, setDisplayColorPicker] = useState("");
  const [colorValue, setColorValue] = useState("#E0CBCB");
  const [colorPlaceholder, setColorPlaceholder] = useState("");

  const toggleColorPicker = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleColorComplete = (color) => {
    onHandleColorPicker(color);
    setColorPlaceholder(color.hex);
  };

  return (
    <div className="color-picker">
      <button className="color-picker-button" onClick={toggleColorPicker}>
        Pick Color
      </button>

      <div
        style={{ backgroundColor: colorPlaceholder }}
        className="color-placeholder"
      ></div>

      {displayColorPicker && (
        <div className="color-picker-popover">
          <div className="cover" onClick={toggleColorPicker} />

          <ChromePicker
            color={colorValue}
            onChange={(color) => {
              setColorValue(color);
            }}
            onChangeComplete={handleColorComplete}
          />
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
