console.log("hello from form!");

// here we will write the logic for the form submission 
// use validation functions, maybe regx (text, numbers,emails)
// and based on the validation we can write the flag to show the error or success state
// we will check the paper for navigation or something else


    // we need to use validation role, 

const formEle = document.getElementById('app-form');


formEle.addEventListener('submit' , onSubmit)
    function onSubmit(e){
        e.preventDefault()
        console.log('Implemented logic for the form submission');
    }
