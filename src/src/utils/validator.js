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

    isValidCommission(commission){
        if(isNaN(commission)){
            return false;
        }
        if(commission < 0 || commission > 100){
            return false;
        }
        return true;
    }

    isValidTitle(){
        return true;
    }

    isValidAuthor(){
        return true;
    }
}