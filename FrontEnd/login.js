console.log("test");

 function identificationLogin(){
    const envoi = document.querySelector(".login-form")

    envoi.addEventListener("submit", async function(event){
        event.preventDefault();
        const infoLogin = {
            email : event.target.querySelector("[name=email]").value,
            password : event.target.querySelector("[name=password]").value,
        }

        const chargeUtile = JSON.stringify(infoLogin);
        try {
            let response = await fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: chargeUtile
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Token reçu :", data.token);
                localStorage.setItem("token", data.token);
                window.location.href = "index.html";
            } else {
                let faux = document.querySelector(".faux");
                faux.style.display = "block";
                setTimeout(function() {
                    faux.style.display = "none";
                },5000);
                console.log("Erreur de connexion :", response.status);
            }

        } catch (error) {
            console.log("Erreur réseau :", error);
        }
    })
}
identificationLogin();