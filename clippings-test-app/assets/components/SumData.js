
import React from 'react';


const SumData = (props) => {
    return (
        <div>
            <table className="table">
                <thead>
                    <tr>
                        <th>Customer</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(props.customers).map(function (total) {
                        return <tr key={total}>
                            <td>{total}</td>
                            <td><span style={color = props.customers[total] < 0 ? "red" : ""}> {props.customers[total]}</span></td>
                        </tr>
                    })
                    }
                </tbody>
            </table>
        </div >
    )
}
export default SumData