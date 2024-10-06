import React from "react";

const Checkbox = (props) => {
  return (
    <div className="mb-3 form-check">
      <input
        id={props.name}
        type="checkbox"
        className="form-check-input"
        name={props.name}
        onChange={props.onChange}
        value={props.value}
        checked={props.checked}
      />
      <label className="form-check-label" htmlFor={props.name}>
        {props.title}
      </label>
    </div>
  );
};

export default Checkbox;
