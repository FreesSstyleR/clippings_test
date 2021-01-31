import React from 'react';

const Select = (props) => {

    return (
        <div className="form-group">
            <label htmlFor={props.name}>{props.title}</label>
            <select
                id={props.name}
                name={props.name}
                className="form-control"
                onChange={props.handleChange}
            >
                <option value="">{props.emptyOptionTitle}</option>

                {props.selectOptions.map(function (value) {
                    return <option key={value} value={value}>{value}</option>
                })
                }
            </select>
        </div>
    )
}
export default Select;