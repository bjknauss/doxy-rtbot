function calc({weight, height}){
    var bmi = weight * height;
    console.log("weight:" + weight);
    console.log("height:" + height);
    console.log("bmi: " + bmi);
}


calc({height: 5, weight: 10});