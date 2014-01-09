var introduction = function () {
    this.preDispatch = function () {
        alert("Before dispatch");
    }
    
    this.postDispatch = function () {
        alert("After displacth");
    }
    
    this.mustache = function () {
        return {win:    "ВЫЙГРАЛИ ПРИЗ"}
    }
}