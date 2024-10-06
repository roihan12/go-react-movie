import React from "react";

const Select = (props) => {
  return (
    <div className="mb-3">
      <label htmlFor={props.name} className="form-label">
        {props.title}
      </label>
      <select
        className="form-select"
        aria-label="Default select example"
        name={props.name}
        id={props.name}
        value={props.value}
        placeholder={props.placeholder}
        onChange={props.onChange}
      >
        <option value="">{props.placeholder}</option>
        {props.options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.value}
          </option>
        ))}
      </select>

      <div className={props.errorDiv}>{props.errorMsg}</div>
    </div>
  );
};

export default Select;
