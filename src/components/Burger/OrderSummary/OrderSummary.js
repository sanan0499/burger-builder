import React,{Component} from "react";
import Aux from '../../../hoc/Auxiliary/Auxiliary';
import Button from '../../UI/Button/Button'

class OrderSummary extends Component {

    render(){
        const ingredientSummary = Object.keys(this.props.ingredients)
            .map(igKey =>{
                return <li key={igKey}><span style={
                    {textTransform: 'capitalize'}
                }>{igKey}</span>: {this.props.ingredients[igKey]}</li>
            });
    return(
        <Aux>
            <h3>Your Order</h3>
            <p>Your burger contains the following ingredients:</p>
            <ul>
                {ingredientSummary}
            </ul>
            <p>Total Price: {this.props.price.toFixed(2)}$</p>
            <p>Continue to checkout?</p>
            <Button
                clicked={this.props.purchaseCanceled}
                btnType="Danger">CANCEL</Button>
            <Button
                clicked={this.props.purchaseContinued}
                btnType="Success">CONTINUE</Button>
        </Aux>
    )}
}

export default OrderSummary;