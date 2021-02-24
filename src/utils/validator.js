export default class Validator {
    isValidPrice(price){
        if(isNaN(price)){
            return false;
        }
        if(price < 0){
            return false;
        }
        return true;
    }

    isValidBidAmount(amount){
        if(isNaN(amount)){
            return false;
        }
        if(amount < 1){
            return false;
        }
        return true;
    }

    isValidIncrement(increment){
        if(isNaN(increment)){
            return false;
        }
        if(increment < 0 || increment > 100){
            return false;
        }
        return true;
    }

    isValidDuration(increment){
        if(isNaN(increment)){
            return false;
        }
        if(increment < 0 || increment > 168){
            return false;
        }
        return true;
    }

    isValidName(name){
        if(!isNaN(name)){
            return false;
        }
        return true;
    }

}