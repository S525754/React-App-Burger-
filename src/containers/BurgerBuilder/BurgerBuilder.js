import React, { Component } from 'react';
import Aux from '../../hoc/Aux1/Aux1.js';
import Burger from '../../components/Burger/Burger.js';
import BuildControls from '../../components/Burger/BuildControls/BuildControls.js';
import Modal from '../../components/UI/Modal/Modal.js';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary.js';
import axios from '../../axios-orders.js';
import Spinner from '../../components/UI/Spinner/Spinner.js';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler.js';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.6,
    meat: 1,
    bacon: 1.5
};

class BurgerBuilder extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //
    //     }
    // }

    state = {
      ingredients : null,
      totalPrice: 4,
      purchasable: false,
      purchasing: false,
      loading: false,
      error: false
    };

    componentDidMount() {
        axios.get('Ingredients.json')
            .then(response => {
                this.setState({ingredients:response.data})
            })
            .catch(error => {
                this.setState({error: true});
            });

    }

    updatePurchaseState(ingredients) {

        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey]
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);

        this.setState({
            purchasable: sum > 0
        });
    };

    purchaseHandler = () => {
        this.setState({purchasing: true});
    };

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    };

    purchaseContinueHandler = () => {
        // alert('You Continue!');
        const queryParams = [];
        for (let i in this.state.ingredients) {
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        }
        queryParams.push('price='+this.state.totalPrice)
        const queryString = queryParams.join('&');
        this.props.history.push({
                pathname: '/checkout',
                search: '?' + queryString
            });
    };

    addIngredientHandler= (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };

        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;

        this.setState({
           ingredients: updatedIngredients,
            totalPrice: newPrice
        });

        this.updatePurchaseState(updatedIngredients);
    };

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if(oldCount <= 0) {
            return;
        }
        const newCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = newCount;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;

        this.setState({
           ingredients: updatedIngredients,
            totalPrice: newPrice
        });

        this.updatePurchaseState(updatedIngredients);
    };

    render() {
        const disableInfo = {
            ...this.state.ingredients
        };

        for(let key in disableInfo) {
            disableInfo[key] = disableInfo[key] <= 0;
        }
        let orderSummary = null;

        let burger = this.state.error ? <p>Ingredients can't be loaded!</p> :<Spinner />;
        if(this.state.ingredients) {
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients} />
                    <BuildControls
                        ingredientAdded={this.addIngredientHandler}
                        ingredientRemoved={this.removeIngredientHandler}
                        disabled={disableInfo}
                        purchasable={!this.state.purchasable}
                        ordered={this.purchaseHandler}
                        price={this.state.totalPrice}
                    />
                </Aux>);
            orderSummary = <OrderSummary
                price={this.state.totalPrice}
                purchaseCanceled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler}
                ingredients={this.state.ingredients} />;
        }


        if(this.state.loading) {
            orderSummary = <Spinner />
        }
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler} >
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);