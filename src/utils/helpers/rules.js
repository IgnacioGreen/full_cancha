const rules = {
    
    validTime(value) {
        if (!value) return true;
        if (Number(value.split(':')[0]) < 24 && Number(value.split(':')[1]) < 60)
            return true;
        else return "Invalid time";
    },   
    required(value) {
        if (value == null || value == '') return "Required";
        return true;
    },
    maxLenght50(value) {
        if (value.length > 50) return "Max 50 characters";
        return true;
    },
    dateOlder(startDate, endDate) {
        if (new Date(endDate) < new Date(startDate)) return "Invalid date";
        return true;
    },

};

export default rules;