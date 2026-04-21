function signup() {
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("Please fill all fields");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters");
        return;
    }

    auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
        alert("Signup Successful!");
        window.location.href = "login.html";
    })
    .catch(err => {
        alert(err.message);
        console.log(err);
    });
}
function login() {
    console.log("Login clicked");

    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("Please fill all fields");
        return;
    }

    auth.signInWithEmailAndPassword(email, password)
    .then(() => {
        alert("Login Successful!");
        window.location.href = "index.html";
    })
    .catch(err => {
        console.error(err);
        alert(err.message);
    });
}

function logout() {
    if (confirm("Are you sure you want to logout?")) {
        auth.signOut().then(() => {
            window.location.href = "login.html";
        });
    }
}

auth.onAuthStateChanged(user => {
    setTimeout(() => {
        const page = window.location.pathname.split("/").pop();

        const publicPages = ["login.html", "signup.html", "index.html"];

        if (!user && !publicPages.includes(page)) {
            window.location.href = "login.html";
        }
    }, 500);
});