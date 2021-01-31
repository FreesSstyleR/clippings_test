import React from 'react';

const Input = (props) => {
    return (
        <div className="form-group" >
            <label htmlFor={props.name}>{props.title}</label>
            <input
                className="form-control"
                type={props.type}
                id={props.name}
                name={props.name}
                value={props.value}
                onChange={props.handleChange}
                step={props.step}
            />
        </div >
    )
}

export default Input
