export default class HelperFunctions {
    ConvertHoursToSeconds(hours){
        if(!isNaN(hours)){
            return hours * 60 * 60;
        }else{
            return null;
        }
    }

    GetMaskedAccount(rawAccount){
        if(!rawAccount) return null;
        return 'xxxxxxxx' + rawAccount.substring(34);
    }
}