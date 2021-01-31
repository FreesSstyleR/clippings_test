import React, { Component } from 'react';
import CSVReader from "react-csv-reader";
import Input from './Inputs/Input';
import Select from './Inputs/Select';
import SumData from './SumData';
import axios from 'axios';

const OUTPUT_CURRENCIES = [
    'USD',
    'EUR',
    'GBP'
];

const parseOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: function transformHeader(header) {
        return header.toLowerCase().replace(/\W/g, '_');
    },
    error: function error(error, fileInfo) {
        alert(error);
    }
};

class Form extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            currencies: {
                EUR: '',
                USD: '',
                GBP: ''
            },
            output_currency: '',
            filter_customer: '',
            customers: [],
            response: []
        };
        this.setOutputCurrency = this.setOutputCurrency.bind(this);
        this.setSelectedFile = this.setSelectedFile.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setCurrency = this.setCurrency.bind(this);
        this.setCustomer = this.setCustomer.bind(this);
    }


    setSelectedFile(data, fileInfo) {
        if (fileInfo.type != "text/csv") {
            document.getElementById('file-upload').value = "";
            data = '';
            alert("You can only upload CSV files.");
        } else {
            //FILTER UNIQUE CURRENCIES
            var unique_currencies = data.map(function (item) {
                return item.currency;
            }).filter(function (value, index, self) {
                return self.indexOf(value) === index;
            });
            var difference = unique_currencies.filter(function (x) {
                return !OUTPUT_CURRENCIES.includes(x);
            });

            if (difference.length > 0) {
                data = '';
                document.getElementById('file-upload').value = "";
                alert("Unsupported currencies in file: \n" + difference.join("\n"));
            } else {
                var unique_customers = data.map(function (item) {
                    return item.customer;
                }).filter(function (value, index, self) {
                    return self.indexOf(value) === index;
                });

                this.setState({ customers: unique_customers });
            }
        }

        this.setState({ data: data });
    };

    setCurrency = value => (event) => {

        let currencies = this.state.currencies;
        currencies[value] = event.target.value;

        this.setState({
            currencies: currencies
        });
    }

    setCustomer(event) {
        this.setState({
            filter_customer: event.target.value
        });
    }

    setOutputCurrency(event) {
        this.setState({
            output_currency: event.target.value
        });
    }

    checkForm(formData) {
        var errors = [];

        if (!formData.data) {
            errors.push("No file selected.");
        }

        var def_currencies = 0;
        Object.entries(formData.currencies).map(function ([key, value]) {
            console.log(value);
            if (!value) {
                errors.push('No value selected for ' + key);
            }

            if (value == 1) {
                def_currencies += 1;
            }
        });

        if (def_currencies != 1) {
            errors.push("You must have one default currency.");
        }

        if (!formData.output_currency) {
            errors.push("You must select an output currency");
        }

        var unique_child_documents = formData.data.map(function (item) {
            return item.parent_document;
        }).filter(function (value, index, self) {
            return self.indexOf(value) === index && value;
        });
        var unique_parent_documents = formData.data.map(function (item) {
            return item.document_number;
        }).filter(function (value, index, self) {
            return self.indexOf(value) === index;
        });
        var difference = unique_child_documents.filter(function (x) {
            return !unique_parent_documents.includes(x);
        });

        if (difference.length > 0) {
            errors.push("Documents do not exist: \n" + difference.join("\n"));
        }

        return errors;
    }

    handleSubmit(event) {
        var errors = this.checkForm(this.state);
        console.log(this.state);
        var that = this;
        if (errors.length > 0) {
            alert("Errors: \n" + errors.join("\n"));
        } else {
            axios.post('/api/csvform', {
                csvData: this.state.data,
                currencies: this.state.currencies,
                output_currency: this.state.output_currency,
                filter_customer: this.state.filter_customer
            }).then(function (response) {
                that.setState({ response: response.data });
            }, function (error) {
                alert(JSON.stringify(error.response.data.errors));
            });
        }

        event.preventDefault();
    }

    render() {
        return (
            <div className="mt-4">
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <CSVReader
                            cssClass={"form-control"}
                            label={"Select CSV file"}
                            onFileLoaded={this.setSelectedFile}
                            parserOptions={parseOptions}
                            inputId={"file-upload"}
                            inputStyle={{ color: 'red' }}
                            accept={".csv"}
                        />
                    </div>

                    {OUTPUT_CURRENCIES.map((item) => {
                        return <Input
                            key={item}
                            type={"number"}
                            title={item + ":"}
                            name={item}
                            handleChange={this.setCurrency(item)}
                            step={"0.001"}
                        />
                    }
                    )}

                    <Select
                        title={"Output Currency:"}
                        name={"output-currency"}
                        handleChange={this.setOutputCurrency}
                        emptyOptionTitle={"-Select an output currency-"}
                        selectOptions={OUTPUT_CURRENCIES}
                    />

                    {this.state.customers.length > 0 &&
                        <Select
                            title={"Filter Customers:"}
                            name={"filter-by-customer"}
                            handleChange={this.setCustomer}
                            emptyOptionTitle={"-Filter by customer-"}
                            selectOptions={this.state.customers}
                        />
                    }

                    <div className="form-group">
                        <input type="submit" className="btn btn-info" value="Submit" />
                    </div>
                </form>

                {Object.keys(this.state.response).length > 0 &&
                    <SumData
                        customers={this.state.response}
                    />

                }
            </div>
        );
    }
}

export default Form;

