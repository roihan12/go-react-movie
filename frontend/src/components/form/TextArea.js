import React from 'react'

const TextArea = (props) => {
  return (
    <div className="mb-3">
      <label htmlFor={props.name} className="form-label">
        {props.title}
      </label>
      <textarea
        className={"form-control"}
        id={props.name}
        name={props.name}
        placeholder={props.placeholder}
        onChange={props.onChange}
        value={props.value}
        rows={props.rows}
      />
      <div className={props.errorDiv}>{props.errorMsg}</div>
    </div>
  )
}

export default TextArea