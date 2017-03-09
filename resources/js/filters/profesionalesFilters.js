Professionals.filter("transformNumber", function(){
   return function(input){
     return Number(input).toLocaleString('es');
   }
});