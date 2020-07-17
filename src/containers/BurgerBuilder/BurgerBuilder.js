import React, { Component} from "react";
import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';


const INGREDIENT_PRICES ={
    salad: 0.5,
    bacon: 1.5,
    cheese: 1,
    meat: 2
}

class BurgerBuilder extends Component{
    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount() {
        axios.get('https://burger-builder-6dd66.firebaseio.com/ingredients.json')
            .then(response=>{
                this.setState({ingredients: response.data})
            })
            .catch(error =>{
                this.setState({error: true})
            });
    }

    updatePurchasable(ingredients){
        //Takes the ingredient state and returns the sum of individual elements
        const sum = Object.keys(ingredients)
            .map(igkey =>{
                return ingredients[igkey]
            }).reduce((sum,el)=>{
                return sum+el;
            }, 0);
        this.setState({purchasable: sum >0})
    }

    addIngredient =(type) =>{
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount+1;
        const updateIngredients = {
            ...this.state.ingredients
        };
        updateIngredients[type]=updatedCount;
        const priceAdd = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice+priceAdd;
        this.setState({
            totalPrice: newPrice,
            ingredients: updateIngredients
        })

    this.updatePurchasable(updateIngredients);
    }

    deleteIngredient = (type)=>{
        const oldCount = this.state.ingredients[type];
        if(oldCount<=0){
            return
        }
        const updatedCount = oldCount-1;
        const updateIngredients = {
            ...this.state.ingredients
        };
        updateIngredients[type] = updatedCount;
        const priceReduce = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice- priceReduce;
        this.setState({
            totalPrice: newPrice,
            ingredients: updateIngredients,

        })
        this.updatePurchasable(updateIngredients);
    }

    purchaseHandler=()=>{
        this.setState({purchasing:true})
    }

    purchaseCancelHandler = () =>{
        this.setState({purchasing:false})
    }

    purchaseContinueHandler = ()=>{
        this.setState({loading: true})
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer:{
                name: 'Sanan Aggarwal',
                address:{
                    street: 'Test Street 1',
                    zipcode: '110019',
                    country: 'India'
                },
                email: 'test@test.com'
            },
            deliveryMethod: 'fastest'
        };
        axios.post('/orders.json',order)
            .then(response =>{
                // console.log(response)
                this.setState({loading: false,purchasing:false})
            })
            .catch(error =>{
                this.setState({loading: false, purchasing: false})
                // console.log(error)
            });
        // alert('You continue');
    }
    render() {
        const disabledInfo ={
            ...this.state.ingredients
        };

        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <=0;
        }
        let ordersummary = null;
        let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner/>;

        if(this.state.ingredients) {
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients}/>
                    <BuildControls
                        ingredientAdded={this.addIngredient}
                        ingredientDeleted={this.deleteIngredient}
                        disabled={disabledInfo}
                        purchasable={this.state.purchasable}
                        price={this.state.totalPrice}
                        ordered={this.purchaseHandler}
                    />
                </Aux>
            );
            ordersummary = <OrderSummary
                price={this.state.totalPrice}
                purchaseCanceled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler}
                ingredients={this.state.ingredients}/>
        }
        if(this.state.loading){
            ordersummary = <Spinner />
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing}
                       modalClosed={this.purchaseCancelHandler}>
                    {ordersummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder,axios);