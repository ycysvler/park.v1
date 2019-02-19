class Common{

    arrayRemove(array, val){
        let index = this.arrayIndexOf(array, val);
        if (index > -1) {
            array.splice(index, 1);
        }

        return array;
    }

    arrayIndexOf(array, val){
        for (var i = 0; i < array.length; i++) {
            if (array[i] == val) return i;
        }

        return -1;
    }

}

export default new Common();