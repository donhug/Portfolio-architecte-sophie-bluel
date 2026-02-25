console.log("test");

function identificationLogin(){
    const envoi = document.querySelector(".login-form")

    envoi.addEventListener("submit", function(event){
        event.preventDefault();
        const infoLogin = {
            email : event.target.querySelector("[name=email]").value,
            password : event.target.querySelector("[name=password]").value,
        }
        //À ENLEVER !!! quand le login est fini
        console.log(infoLogin);

        const chargeUtile = JSON.stringify(infoLogin);
        fetch("http://localhost:5678/api/users/login",{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: chargeUtile
        });
    })
}
identificationLogin()