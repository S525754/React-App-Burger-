import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import Spinner from '../../../components/UI/Spinner/Spinner';
import axios from '../../../axios-orders';
import Input from '../../../components/UI/Input/Input';

class ContactData extends Component {
    state = {
        orderForm: {
                name: {
                    elementType: 'input',
                    elementConfig: {
                        type: 'text',
                        placeholder: 'Enter your Name'
                    },
                    value: '',
                    validation: {
                        required: true
                    },
                    valid: false,
                    touched: false
                },
                Address1: {
                    elementType: 'input',
                    elementConfig: {
                        type: 'text',
                        placeholder: 'Enter your Address1'
                    },
                    value: '',
                    validation: {
                        required: true
                    },
                    valid: false,
                    touched: false
                },
                Address2: {
                    elementType: 'input',
                    elementConfig: {
                        type: 'text',
                        placeholder: 'Enter your Address2'
                    },
                    value: ''
                },
                City: {
                    elementType: 'input',
                    elementConfig: {
                        type: 'text',
                        placeholder: 'Enter Your City'
                    },
                    value: '',
                    validation: {
                        required: true
                    },
                    valid: false,
                    touched: false
                },
                State: {
                    elementType: 'input',
                    elementConfig: {
                        type: 'text',
                        placeholder: 'Enter Your State'
                    },
                    value: '',
                    validation: {
                        required: true
                    },
                    valid: false,
                    touched: false
                },
                Country: {
                    elementType: 'input',
                    elementConfig: {
                        type: 'text',
                        placeholder: 'Enter Your Country'
                    },
                    value: '',
                    validation: {
                        required: true
                    },
                    valid: false,
                    touched: false
                },
                Zipcode: {
                    elementType: 'input',
                    elementConfig: {
                        type: 'text',
                        placeholder: 'Enter Your Zipcode'
                    },
                    value: '',
                    validation: {
                        required: true,
                        minLength: 5,
                        maxLength: 5,
                    },
                    valid: false,
                    touched: false
                },
                email: {
                    elementType: 'input',
                    elementConfig: {
                        type: 'text',
                        placeholder: 'Enter Your Email ID'
                    },
                    value: '',
                    validation: {
                        required: true
                    },
                    valid: false,
                    touched: false
                },
                PhoneNumber: {
                    elementType: 'input',
                    elementConfig: {
                        type: 'text',
                        placeholder: 'Enter Your Phone Number'
                    },
                    value: '',
                    validation: {
                        required: true
                    },
                    valid: false,
                    touched: false
                },
                deiveryMethod: {
                    elementType: 'select',
                    elementConfig: {
                        options: [
                            {value: 'fastest', displayValue: 'Fastest'},
                            {value: 'cheapest', displayValue: 'Cheapest'},
                        ]
                    },
                    value: '',
                    valid: true
                }

        },
        formIsValid: false,
        loading: false
    };

    orderHandler = (event) => {
        event.preventDefault();
        this.setState({loading: true});
        const formData = {};
        for(let formElementIdentifier in this.state.orderForm) {
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }
        const order = {
            ingredients: this.props.ings,
            price: this.props.price,
            orderForm: formData
        };

        axios.post('/orders.json', order).
            then(response => {
                this.setState({loading: false});
                this.props.history.push('/');
            })
            .catch(error => {
                this.setState({loading: false});
            });

    };

    checkValidity(value, rules) {
        let isValid = true;

        if(rules.required) {
            isValid = value.trim() !== '' && isValid;
        }
        if(rules.minLength) {
            isValid = value.length >= rules.minLength && isValid;
        }
        if(rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid;
        }

        return isValid;
    }

    inputChangedHandler = (event, inputIdentifier) => {
        const updatedOrderForm = {
            ...this.state.orderForm
        };
        const updatedFormElement = {
            ...updatedOrderForm[inputIdentifier]
        };
        updatedFormElement.value = event.target.value;
        if(updatedFormElement.validation) {
            updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
        }

        updatedFormElement.touched = true;
        updatedOrderForm[inputIdentifier] = updatedFormElement;

        let formIsValid = true;
        for(let inputIdentifier in updatedOrderForm) {
            formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
        }

        this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid});

    }

    render() {
        let formElementsArr = [];
        for (let key in this.state.orderForm) {
            formElementsArr.push({
                id: key,
                config: this.state.orderForm[key]
            })
        }
        let form = {};
        if(this.state.loading) {
            form = <Spinner />;
        }
        else {
            form = <form onSubmit={this.orderHandler} >

                    {formElementsArr.map(formElement => (
                        <Input
                            key={formElement.id}
                            elementType={formElement.config.elementType}
                            elementConfig={formElement.config.elementConfig}
                            value={formElement.config.value}
                            invalid={!formElement.config.valid}
                            shouldValidate={formElement.config.validation}
                            touched={formElement.config.touched}
                            changed={(event) => this.inputChangedHandler(event, formElement.id)} />
                    ))}
                    <Button btnType="Success" clicked={this.orderHandler} disabled={!this.state.formIsValid} >ORDER</Button>
                </form>
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Details</h4>
                {form}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        price: state.totalPrice
    }
}

export default connect(mapStateToProps)(ContactData);