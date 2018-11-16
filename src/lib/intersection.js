export default (arr1, arr2) => {
    return arr1.filter(function(value) {
        return arr2.indexOf(value) > -1;
    });
}